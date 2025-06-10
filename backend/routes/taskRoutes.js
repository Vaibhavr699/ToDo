import express from 'express';
import {
  getTasks,
  getTasksByStatus,
  getTasksByPriority,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Task routes
router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/status/:status')
  .get(getTasksByStatus);

router.route('/priority/:priority')
  .get(getTasksByPriority);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

export default router;