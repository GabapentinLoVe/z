import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  addPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject
} from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/users/:id', authMiddleware, getUserProfile);
router.put('/users/:id', authMiddleware, updateUserProfile);
router.post('/users/:id/portfolio', authMiddleware, addPortfolioProject);
router.put('/users/:id/portfolio/:projectId', authMiddleware, updatePortfolioProject);
router.delete('/users/:id/portfolio/:projectId', authMiddleware, deletePortfolioProject);

export default router; 