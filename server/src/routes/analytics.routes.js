const router = require('express').Router();
const { getAnalytics } = require('../controllers/analytics.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, authorize('admin'), getAnalytics);

module.exports = router;
