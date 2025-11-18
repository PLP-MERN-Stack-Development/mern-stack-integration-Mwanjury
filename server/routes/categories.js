const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', categoryController.getCategories);
router.post('/', protect, categoryController.createCategory);

module.exports = router;
