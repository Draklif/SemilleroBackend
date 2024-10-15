import express from 'express';
import { validate } from '../middlewares/authMiddleware.js';
import {
  getAllProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/data', getAllProjects);
router.get('/data/:id', getProjectById);
router.post('/data', validate, addProject);
router.put('/data/:id', validate, updateProject);
router.delete('/data/:id', validate, deleteProject);

export default router;
