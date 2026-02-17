const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const AppError = require('../utils/AppError');

const SALT_ROUNDS = 10;

async function register({ email, password, firstName, lastName, phone }) {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new AppError('Email already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await pool.query(
    `INSERT INTO users (email, password, first_name, last_name, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, first_name, last_name, phone, role, created_at`,
    [email, hashedPassword, firstName, lastName, phone || null]
  );

  const user = result.rows[0];
  const token = generateToken(user);
  return { user: formatUser(user), token };
}

async function login({ email, password }) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    throw new AppError('Invalid email or password', 401);
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user);
  return { user: formatUser(user), token };
}

async function getMe(userId) {
  const result = await pool.query(
    'SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE id = $1',
    [userId]
  );
  if (result.rows.length === 0) {
    throw new AppError('User not found', 404);
  }
  return formatUser(result.rows[0]);
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function formatUser(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    role: user.role,
    createdAt: user.created_at,
  };
}

module.exports = { register, login, getMe };
