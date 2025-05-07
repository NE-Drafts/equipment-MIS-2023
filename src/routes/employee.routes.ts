import express from 'express';
import {
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employee.controller';
import { authenticate, checkAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

// Protect all routes below with authentication and admin check
router.use(authenticate, checkAdmin);

router.post('/addEmployee', addEmployee);
router.get('/getEmployees', getEmployees);
router.get('/getEmployeeById/:id', getEmployeeById);
router.patch('/updateEmployeeById/:id', updateEmployee);
router.delete('/deleteEmployeeById/:id', deleteEmployee);

export default router;
