import express from 'express';
import { addEmployee, getEmployees } from '../controllers/employee.controller';
import { authenticate, checkAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

// 👇 Protect both routes
router.post('/addEmployee', authenticate, checkAdmin, addEmployee);
router.get('/getEmployees', authenticate, checkAdmin, getEmployees);

export default router;
