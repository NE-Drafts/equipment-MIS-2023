import { Request, Response } from 'express';
import prisma from '../config/db';
import { hashPassword, comparePasswords } from '../utils/hash';
import { Role } from '@prisma/client';
import { generateToken } from '../utils/token';
import { z } from 'zod';
interface User {
  id: string;
  email: string;
  password: string;
  role?: Role;
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    if(confirmPassword !== password) {
      return res.status(400).json({ message: 'Passwords do not match' });   
    }
    const hashed = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, password: hashed, role } });


    console.log('User created:', JSON.stringify(user, null, 2));
    return res.status(201).json({ message: 'User created', user: { id: user.id, email: user.email } });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await comparePasswords(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    const token = generateToken(user.id.toString());
    if (!token) return res.status(500).json({ message: 'Token generation failed' });
    return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed' });
  }
  finally {
    console.log('Login attempt:', JSON.stringify(req.body, null, 2));
  }
};
