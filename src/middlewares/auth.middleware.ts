import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Role } from '@prisma/client';
import { decode } from 'punycode';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: Role };
    (req as any).user = decoded; // store decoded user info in request
    next();
  } catch (err) {
    return res.status(401).json({
      message:
        'You are not authorised to perform this action. Please contact the admin or check your token.',
    });
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }

  next(); // user is an admin, continue
};
