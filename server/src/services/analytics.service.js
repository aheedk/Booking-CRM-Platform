const pool = require('../config/db');

async function getSummaryStats() {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM users WHERE role = 'client') AS total_clients,
      (SELECT COUNT(*) FROM appointments) AS total_bookings,
      (SELECT COALESCE(SUM(s.price), 0)
         FROM appointments a
         JOIN services s ON a.service_id = s.id
         WHERE a.status = 'completed') AS total_revenue,
      (SELECT COUNT(*) FROM appointments
         WHERE date_trunc('month', start_time) = date_trunc('month', NOW())) AS bookings_this_month
  `);
  return result.rows[0];
}

async function getMonthlyBookings() {
  const result = await pool.query(`
    SELECT
      to_char(date_trunc('month', start_time), 'Mon YYYY') AS month,
      COUNT(*) AS count
    FROM appointments
    WHERE start_time >= NOW() - INTERVAL '6 months'
    GROUP BY date_trunc('month', start_time)
    ORDER BY date_trunc('month', start_time)
  `);
  return result.rows;
}

async function getMonthlyRevenue() {
  const result = await pool.query(`
    SELECT
      to_char(date_trunc('month', a.start_time), 'Mon YYYY') AS month,
      COALESCE(SUM(s.price), 0) AS revenue
    FROM appointments a
    JOIN services s ON a.service_id = s.id
    WHERE a.status = 'completed'
      AND a.start_time >= NOW() - INTERVAL '6 months'
    GROUP BY date_trunc('month', a.start_time)
    ORDER BY date_trunc('month', a.start_time)
  `);
  return result.rows;
}

async function getStatusBreakdown() {
  const result = await pool.query(`
    SELECT status, COUNT(*) AS count
    FROM appointments
    GROUP BY status
    ORDER BY count DESC
  `);
  return result.rows;
}

async function getTopServices() {
  const result = await pool.query(`
    SELECT
      s.name,
      COUNT(a.id) AS booking_count,
      COALESCE(SUM(s.price) FILTER (WHERE a.status = 'completed'), 0) AS revenue
    FROM services s
    LEFT JOIN appointments a ON a.service_id = s.id
    WHERE s.is_active = true
    GROUP BY s.id, s.name
    ORDER BY booking_count DESC
    LIMIT 5
  `);
  return result.rows;
}

module.exports = {
  getSummaryStats,
  getMonthlyBookings,
  getMonthlyRevenue,
  getStatusBreakdown,
  getTopServices,
};
