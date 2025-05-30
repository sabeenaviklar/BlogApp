import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  autoSaveBlog,
  getUserBlogs
} from '../controllers/blogController.js';

const router = express.Router();

// Validation rules
const blogValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Status must be draft or published')
];

// Public routes
router.get('/', optionalAuth, getAllBlogs);
router.get('/:id', optionalAuth, getBlogById);

// Protected routes
router.use(authenticateToken);

router.get('/user/me', getUserBlogs);
router.post('/', blogValidation, createBlog);
router.put('/:id', blogValidation, updateBlog);
router.delete('/:id', deleteBlog);
router.post('/autosave', autoSaveBlog);

export default router;
