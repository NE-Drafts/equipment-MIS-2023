// employee.controller.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
/**
 * @swagger
 * /api/employees/addEmployee:
 *   post:
 *     summary: Add a new employee
 *     description: Creates a new employee record in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - nationalId
 *               - telephone
 *               - email
 *               - department
 *               - position
 *               - manufacturer
 *               - model
 *               - serialNumber
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               nationalId:
 *                 type: string
 *                 example: "1234567890123456"
 *               telephone:
 *                 type: string
 *                 example: "0781234567"
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               department:
 *                 type: string
 *                 example: Engineering
 *               position:
 *                 type: string
 *                 example: Software Engineer
 *               manufacturer:
 *                 type: string
 *                 example: Dell
 *               model:
 *                 type: string
 *                 example: Latitude 5420
 *               serialNumber:
 *                 type: string
 *                 example: SN987654321
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: National ID already exists
 *       500:
 *         description: Internal server error
 */

export const addEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newEmployee = await prisma.employee.create({
      data: req.body,
    });
    res.status(201).json(newEmployee);
  } catch (err: any) {
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0];
      if (field === 'nationalId') {
        return res.status(400).json({
          message: `The National ID ${req.body.nationalId} already exists. Please provide a unique ID.`,
        });
      }
    }
    next(err);
  }
};
/**
 * @swagger
 * /api/employees/getEmployees:
 *   get:
 *     summary: Get list of employees
 *     description: Fetches a paginated list of employees from the system.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number to fetch
 *     responses:
 *       200:
 *         description: A list of employees with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       firstname:
 *                         type: string
 *                       lastname:
 *                         type: string
 *                       nationalId:
 *                         type: string
 *                       telephone:
 *                         type: string
 *                       email:
 *                         type: string
 *                       department:
 *                         type: string
 *                       position:
 *                         type: string
 *                       manufacturer:
 *                         type: string
 *                       model:
 *                         type: string
 *                       serialNumber:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */

export const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;

    const employees = await prisma.employee.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { id: 'asc' },
    });

    const total = await prisma.employee.count();

    res.status(200).json({
      data: employees,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @swagger
 * /api/employees/getEmployeeById/{id}:
 *   get:
 *     summary: Get a single employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The employee ID
 *     responses:
 *       200:
 *         description: Employee found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 */

export const getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const employee = await prisma.employee.findUnique({ where: { id } });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (err) {
    next(err);
  }
};
/**
 * @swagger
 * /api/employees/updateEmployee/{id}:
 *   patch:
 *     summary: Update an existing employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/index'
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Duplicate National ID
 *       404:
 *         description: Employee not found
 */

export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json(updatedEmployee);
  } catch (err: any) {
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0];
      if (field === 'nationalId') {
        return res.status(400).json({
          message: `The National ID ${req.body.nationalId} already exists. Please provide a unique ID.`,
        });
      }
    }
    next(err);
  }
};

/**
 * @swagger
 * /api/employees/deleteEmployee/{id}:
 *   delete:
 *     summary: Delete an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */

export const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await prisma.employee.delete({ where: { id } });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    next(err);
  }
};
