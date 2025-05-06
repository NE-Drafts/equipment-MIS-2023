import express from 'express';
import {
//   createEmployee,
  getEmployees
//   updateEmployee,
//   deleteEmployee,
} from '../controllers/employee.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

// All employee routes are protected and admin-only
router.use(authenticate, authorizeAdmin);

// router.post('/', createEmployee);
router.get('/', getEmployees);
// router.put('/:id', updateEmployee);
// router.delete('/:id', deleteEmployee);

export default router;
