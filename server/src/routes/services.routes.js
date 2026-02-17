const router = require('express').Router();
const { getAll, getById, create, update, remove } = require('../controllers/services.controller');
const { serviceValidator } = require('../validators/services.validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', auth, authorize('admin'), serviceValidator, validate, create);
router.put('/:id', auth, authorize('admin'), serviceValidator, validate, update);
router.delete('/:id', auth, authorize('admin'), remove);

module.exports = router;
