import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

// Define employee schema for validation
const employeeSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  nationalId: z.string().length(16),
  telephone: z.string().min(10).max(15),
  email: z.string().email(),
  department: z.string(),
  position: z.string(),
  manufacturer: z.string(),
  model: z.string(),
  serialNumber: z.string(),
});

// 1. Add a new employee
export const addEmployee = async (req: Request, res: Response) => {
  try {
    const parsed = employeeSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() });
    }

    const {
      firstname,
      lastname,
      nationalId,
      telephone,
      email,
      department,
      position,
      manufacturer,
      model,
      serialNumber,
    } = parsed.data;

    const newEmployee = await prisma.employee.create({
      data: {
        firstname,
        lastname,
        nationalId,
        telephone,
        email,
        department,
        position,
        manufacturer,
        model,
        serialNumber,
      },
    });

    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

// 2. Get all employees (with pagination)
export const getEmployees = async (req: Request, res: Response) => {
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
    res.status(500).json({ message: 'Server Error', error: err });
  }
};
