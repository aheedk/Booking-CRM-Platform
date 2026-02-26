const pool = require('../config/db');
const AppError = require('../utils/AppError');
const { emitToUser, emitToAdmins } = require('../utils/socketManager');

async function createAppointment(clientId, { serviceId, startTime, notes }) {
  // Get service duration
  const svcResult = await pool.query(
    'SELECT duration FROM services WHERE id = $1 AND is_active = true',
    [serviceId]
  );
  if (svcResult.rows.length === 0) {
    throw new AppError('Service not found', 404);
  }

  const durationMinutes = svcResult.rows[0].duration;
  const start = new Date(startTime);
  const end = new Date(start.getTime() + durationMinutes * 60000);

  // Application-level overlap check
  const conflict = await pool.query(
    `SELECT id FROM appointments
     WHERE status <> 'cancelled'
       AND start_time < $2
       AND end_time > $1`,
    [start.toISOString(), end.toISOString()]
  );

  if (conflict.rows.length > 0) {
    throw new AppError('This time slot is no longer available', 409);
  }

  try {
    const result = await pool.query(
      `INSERT INTO appointments (client_id, service_id, start_time, end_time, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [clientId, serviceId, start.toISOString(), end.toISOString(), notes || null]
    );
    const appointment = result.rows[0];
    const ts = new Date().toISOString();
    emitToUser(clientId, 'notification', {
      type: 'appointment_created',
      message: 'Your appointment has been booked successfully.',
      appointment,
      timestamp: ts,
    });
    emitToAdmins('notification', {
      type: 'new_booking',
      message: `New appointment booked (ID: ${appointment.id})`,
      appointment,
      timestamp: ts,
    });
    return appointment;
  } catch (err) {
    // Database exclusion constraint violation (race condition safety net)
    if (err.code === '23P01') {
      throw new AppError('This time slot is no longer available', 409);
    }
    throw err;
  }
}

async function getAllAppointments() {
  const result = await pool.query(
    `SELECT a.*, s.name as service_name, s.duration, s.price,
            u.first_name as client_first_name, u.last_name as client_last_name, u.email as client_email
     FROM appointments a
     JOIN services s ON a.service_id = s.id
     JOIN users u ON a.client_id = u.id
     ORDER BY a.start_time DESC`
  );
  return result.rows;
}

async function getClientAppointments(clientId) {
  const result = await pool.query(
    `SELECT a.*, s.name as service_name, s.duration, s.price
     FROM appointments a
     JOIN services s ON a.service_id = s.id
     WHERE a.client_id = $1
     ORDER BY a.start_time DESC`,
    [clientId]
  );
  return result.rows;
}

async function getAppointmentById(id) {
  const result = await pool.query(
    `SELECT a.*, s.name as service_name, s.duration, s.price,
            u.first_name as client_first_name, u.last_name as client_last_name
     FROM appointments a
     JOIN services s ON a.service_id = s.id
     JOIN users u ON a.client_id = u.id
     WHERE a.id = $1`,
    [id]
  );
  if (result.rows.length === 0) {
    throw new AppError('Appointment not found', 404);
  }
  return result.rows[0];
}

async function updateStatus(id, status) {
  const result = await pool.query(
    `UPDATE appointments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, id]
  );
  if (result.rows.length === 0) {
    throw new AppError('Appointment not found', 404);
  }
  const appointment = result.rows[0];
  const ts = new Date().toISOString();
  emitToUser(appointment.client_id, 'notification', {
    type: 'appointment_updated',
    message: `Your appointment status has been updated to: ${status}.`,
    appointment,
    timestamp: ts,
  });
  emitToAdmins('notification', {
    type: 'appointment_updated',
    message: `Appointment ${appointment.id} status changed to ${status}`,
    appointment,
    timestamp: ts,
  });
  return appointment;
}

async function cancelAppointment(id, clientId) {
  const result = await pool.query(
    `UPDATE appointments SET status = 'cancelled', updated_at = NOW()
     WHERE id = $1 AND client_id = $2 AND status = 'scheduled'
     RETURNING *`,
    [id, clientId]
  );
  if (result.rows.length === 0) {
    throw new AppError('Appointment not found or cannot be cancelled', 404);
  }
  const appointment = result.rows[0];
  const ts = new Date().toISOString();
  emitToUser(appointment.client_id, 'notification', {
    type: 'appointment_cancelled',
    message: 'Your appointment has been cancelled.',
    appointment,
    timestamp: ts,
  });
  emitToAdmins('notification', {
    type: 'appointment_cancelled',
    message: `Appointment ${appointment.id} was cancelled by client`,
    appointment,
    timestamp: ts,
  });
  return appointment;
}

async function getAvailability(serviceId, date) {
  // Get service duration
  const svcResult = await pool.query(
    'SELECT duration FROM services WHERE id = $1 AND is_active = true',
    [serviceId]
  );
  if (svcResult.rows.length === 0) {
    throw new AppError('Service not found', 404);
  }

  const duration = svcResult.rows[0].duration;

  // Get all non-cancelled appointments for the given date
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const booked = await pool.query(
    `SELECT start_time, end_time FROM appointments
     WHERE status <> 'cancelled'
       AND start_time >= $1
       AND start_time <= $2
     ORDER BY start_time`,
    [dayStart.toISOString(), dayEnd.toISOString()]
  );

  // Generate available slots (business hours: 9 AM - 5 PM)
  const slots = [];
  const businessStart = 9;
  const businessEnd = 17;

  for (let hour = businessStart; hour < businessEnd; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, min, 0, 0);
      const slotEnd = new Date(slotStart.getTime() + duration * 60000);

      // Check slot doesn't exceed business hours
      if (slotEnd.getHours() > businessEnd || (slotEnd.getHours() === businessEnd && slotEnd.getMinutes() > 0)) {
        continue;
      }

      // Check no overlap with existing appointments
      const hasConflict = booked.rows.some((appt) => {
        const apptStart = new Date(appt.start_time);
        const apptEnd = new Date(appt.end_time);
        return slotStart < apptEnd && slotEnd > apptStart;
      });

      if (!hasConflict) {
        slots.push({
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
        });
      }
    }
  }

  return slots;
}

module.exports = {
  createAppointment,
  getAllAppointments,
  getClientAppointments,
  getAppointmentById,
  updateStatus,
  cancelAppointment,
  getAvailability,
};
