const { body } = require('express-validator');

const serviceValidator = [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer (minutes)'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('description').optional().trim(),
];

module.exports = { serviceValidator };
