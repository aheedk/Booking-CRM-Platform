const pool = require('../config/db');
const AppError = require('../utils/AppError');

async function getAllServices() {
  const result = await pool.query(
    'SELECT * FROM services WHERE is_active = true ORDER BY name'
  );
  return result.rows;
}

async function getServiceById(id) {
  const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    throw new AppError('Service not found', 404);
  }
  return result.rows[0];
}

async function createService({ name, description, duration, price }) {
  const result = await pool.query(
    `INSERT INTO services (name, description, duration, price)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description || null, duration, price]
  );
  return result.rows[0];
}

async function updateService(id, { name, description, duration, price }) {
  const result = await pool.query(
    `UPDATE services
     SET name = $1, description = $2, duration = $3, price = $4, updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [name, description || null, duration, price, id]
  );
  if (result.rows.length === 0) {
    throw new AppError('Service not found', 404);
  }
  return result.rows[0];
}

async function deleteService(id) {
  const result = await pool.query(
    `UPDATE services SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id`,
    [id]
  );
  if (result.rows.length === 0) {
    throw new AppError('Service not found', 404);
  }
}

module.exports = { getAllServices, getServiceById, createService, updateService, deleteService };
