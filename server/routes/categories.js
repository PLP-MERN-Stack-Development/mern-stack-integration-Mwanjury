import express from 'express';
import categoryController from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.post('/', protect, categoryController.createCategory);

export default router;

