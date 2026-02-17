const { body, query } = require('express-validator');

const bookAppointmentValidator = [
  body('serviceId').isUUID().withMessage('Valid service ID is required'),
  body('startTime').isISO8601().withMessage('Valid start time is required (ISO 8601)'),
  body('notes').optional().trim(),
];

const updateStatusValidator = [
  body('status').isIn(['completed', 'cancelled']).withMessage('Status must be completed or cancelled'),
];

const availabilityValidator = [
  query('serviceId').isUUID().withMessage('Valid service ID is required'),
  query('date').isISO8601().withMessage('Valid date is required (YYYY-MM-DD)'),
];

module.exports = { bookAppointmentValidator, updateStatusValidator, availabilityValidator };
