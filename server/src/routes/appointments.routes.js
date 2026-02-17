const router = require('express').Router();
const ctrl = require('../controllers/appointments.controller');
const { bookAppointmentValidator, updateStatusValidator, availabilityValidator } = require('../validators/appointments.validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/availability', auth, availabilityValidator, validate, ctrl.getAvailability);
router.get('/mine', auth, ctrl.getMine);
router.get('/', auth, authorize('admin'), ctrl.getAll);
router.get('/:id', auth, ctrl.getById);
router.post('/', auth, authorize('client'), bookAppointmentValidator, validate, ctrl.book);
router.patch('/:id/status', auth, authorize('admin'), updateStatusValidator, validate, ctrl.updateStatus);
router.patch('/:id/cancel', auth, ctrl.cancel);

module.exports = router;
