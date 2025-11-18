const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/upload');

router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);

router.post('/', protect, upload.single('featuredImage'), postController.createPost);
router.put('/:id', protect, upload.single('featuredImage'), postController.updatePost);
router.delete('/:id', protect, postController.deletePost);

router.post('/:id/comments', protect, postController.addComment);

module.exports = router;
