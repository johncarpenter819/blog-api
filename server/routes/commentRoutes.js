const express = require('express');
const router = express.Router();
const { addComment, deleteComment, getCommentsForPost } = require('../controllers/commentController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/:id', addComment);
router.delete('/:id', authenticateToken, deleteComment);
router.get('/:id', getCommentsForPost);

module.exports = router;