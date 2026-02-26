const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const servicesRoutes = require('./routes/services.routes');
const appointmentsRoutes = require('./routes/appointments.routes');
const clientsRoutes = require('./routes/clients.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

const app = express();

// Middleware
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;
