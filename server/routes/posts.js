import express from 'express';
import postController from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);

router.post('/', protect, upload.single('featuredImage'), postController.createPost);
router.put('/:id', protect, upload.single('featuredImage'), postController.updatePost);
router.delete('/:id', protect, postController.deletePost);

router.post('/:id/comments', protect, postController.addComment);

export default router;
