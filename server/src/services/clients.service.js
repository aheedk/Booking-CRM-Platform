const pool = require('../config/db');
const AppError = require('../utils/AppError');

async function getAllClients() {
  const result = await pool.query(
    `SELECT id, email, first_name, last_name, phone, created_at
     FROM users
     WHERE role = 'client'
     ORDER BY last_name, first_name`
  );
  return result.rows;
}

async function getClientById(id) {
  const userResult = await pool.query(
    `SELECT id, email, first_name, last_name, phone, created_at
     FROM users WHERE id = $1 AND role = 'client'`,
    [id]
  );
  if (userResult.rows.length === 0) {
    throw new AppError('Client not found', 404);
  }

  const appointmentsResult = await pool.query(
    `SELECT a.*, s.name as service_name, s.price
     FROM appointments a
     JOIN services s ON a.service_id = s.id
     WHERE a.client_id = $1
     ORDER BY a.start_time DESC`,
    [id]
  );

  return {
    ...userResult.rows[0],
    appointments: appointmentsResult.rows,
  };
}

async function getClientNotes(clientId) {
  const result = await pool.query(
    `SELECT cn.*, u.first_name as author_first_name, u.last_name as author_last_name
     FROM client_notes cn
     JOIN users u ON cn.author_id = u.id
     WHERE cn.client_id = $1
     ORDER BY cn.created_at DESC`,
    [clientId]
  );
  return result.rows;
}

async function addClientNote(clientId, authorId, content) {
  // Verify client exists
  const client = await pool.query(
    'SELECT id FROM users WHERE id = $1 AND role = $2',
    [clientId, 'client']
  );
  if (client.rows.length === 0) {
    throw new AppError('Client not found', 404);
  }

  const result = await pool.query(
    `INSERT INTO client_notes (client_id, author_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [clientId, authorId, content]
  );
  return result.rows[0];
}

async function deleteClientNote(noteId) {
  const result = await pool.query(
    'DELETE FROM client_notes WHERE id = $1 RETURNING id',
    [noteId]
  );
  if (result.rows.length === 0) {
    throw new AppError('Note not found', 404);
  }
}

module.exports = { getAllClients, getClientById, getClientNotes, addClientNote, deleteClientNote };
