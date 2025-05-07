// employee.controller.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

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
