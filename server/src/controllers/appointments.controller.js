const appointmentsService = require('../services/appointments.service');

async function book(req, res, next) {
  try {
    const appointment = await appointmentsService.createAppointment(req.user.id, req.body);
    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const appointments = await appointmentsService.getAllAppointments();
    res.json(appointments);
  } catch (err) {
    next(err);
  }
}

async function getMine(req, res, next) {
  try {
    const appointments = await appointmentsService.getClientAppointments(req.user.id);
    res.json(appointments);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const appointment = await appointmentsService.getAppointmentById(req.params.id);
    res.json(appointment);
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const appointment = await appointmentsService.updateStatus(req.params.id, req.body.status);
    res.json(appointment);
  } catch (err) {
    next(err);
  }
}

async function cancel(req, res, next) {
  try {
    const appointment = await appointmentsService.cancelAppointment(req.params.id, req.user.id);
    res.json(appointment);
  } catch (err) {
    next(err);
  }
}

async function getAvailability(req, res, next) {
  try {
    const slots = await appointmentsService.getAvailability(req.query.serviceId, req.query.date);
    res.json(slots);
  } catch (err) {
    next(err);
  }
}

module.exports = { book, getAll, getMine, getById, updateStatus, cancel, getAvailability };
