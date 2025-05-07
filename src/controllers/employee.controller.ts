import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

// Define employee schema for validation
const employeeSchema = z.object({
  firstname: z.string().min(1, { message: 'Firstname is required' }),
  lastname: z.string().min(1, { message: 'Lastname is required' }),
  nationalId: z.string().length(16, { message: 'National ID must be exactly 16 characters' }),
  telephone: z.string().min(10, { message: 'Telephone number must be at least 10 characters' })
    .max(15, { message: 'Telephone number can be at most 15 characters' }),
  email: z.string().email({ message: 'Invalid email format' }),
  department: z.string().min(1, { message: 'Department is required' }),
  position: z.string().min(1, { message: 'Position is required' }),
  manufacturer: z.string().min(1, { message: 'Manufacturer is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  serialNumber: z.string().min(1, { message: 'Serial number is required' }),
});

// 1. Add a new employee
export const addEmployee = async (req: Request, res: Response) => {
  try {
    const parsed = employeeSchema.safeParse(req.body);

    if (!parsed.success) {
      // Handle the validation errors from the schema
      return res.status(400).json({
        message: 'Validation Error',
        errors: parsed.error.errors.map(err => ({
          field: err.path[0],
          message: err.message,
        })),
      });
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

    // Attempt to create the new employee
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
    // Custom error handling for Prisma unique constraint errors
    if (err instanceof Error && 'code' in err && err.code === 'P2002') {
      const field = (err as any).meta?.target?.[0];
      if (field === 'nationalId') {
        return res.status(400).json({
          message: `The National ID ${req.body.nationalId} already exists. Please provide a unique ID.`,
        });
      }
      // Add handling for other fields if needed, similar to 'nationalId'
    }

    // Generic server error
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

// 3. Get a single employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const employee = await prisma.employee.findUnique({ where: { id } });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

// 4. Update an employee
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const parsed = employeeSchema.safeParse(req.body);

    if (!parsed.success) {
      // Handle the validation errors from the schema
      return res.status(400).json({
        message: 'Validation Error',
        errors: parsed.error.errors.map(err => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: parsed.data,
    });

    res.status(200).json(updatedEmployee);
  } catch (err) {
    // Custom error handling for Prisma unique constraint errors
    if (err instanceof Error && 'code' in err && err.code === 'P2002') {
      const field = (err as any).meta?.target?.[0];
      if (field === 'nationalId') {
        return res.status(400).json({
          message: `The National ID ${req.body.nationalId} already exists. Please provide a unique ID.`,
        });
      }
      // Add handling for other fields if needed, similar to 'nationalId'
    }

    // Generic server error
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

// 5. Delete an employee
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await prisma.employee.delete({ where: { id } });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};
