const express = require('express');
const router = express.Router();
const{
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/postController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);

module.exports = router;