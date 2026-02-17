const router = require('express').Router();
const { getAll, getById, getNotes, addNote, deleteNote } = require('../controllers/clients.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, authorize('admin'), getAll);
router.get('/:id', auth, authorize('admin'), getById);
router.get('/:id/notes', auth, authorize('admin'), getNotes);
router.post('/:id/notes', auth, authorize('admin'), addNote);
router.delete('/:id/notes/:noteId', auth, authorize('admin'), deleteNote);

module.exports = router;
