import { Router } from 'express';
import {
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employee.controller';
import { validateDto } from '../middlewares/validator.middleware';
import { employeeSchema } from '../dtos/employee.dto';
import { authenticate, checkAdmin } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticate, checkAdmin);

router.post('/addEmployee', validateDto(employeeSchema), addEmployee);
router.get('/getEmployees', getEmployees);
router.get('/getEmployeeById/:id', getEmployeeById);
router.put('/updateEmployee/:id', validateDto(employeeSchema), updateEmployee);
router.delete('/deleteEmployee/:id', deleteEmployee);

export default router;
