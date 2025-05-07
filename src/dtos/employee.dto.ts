import { z } from 'zod';

export const employeeSchema = z.object({
  firstname: z.string({ message: "Firstname must be characters, not numbers!" })
    .nonempty({ message: 'Firstname is required' })
    .min(2, { message: 'Firstname must be at least 2 characters' })
    .max(50, { message: 'Firstname can be at most 50 characters' }),

  lastname: z.string({ message: "Lastname must be characters, not numbers!" })
    .nonempty({ message: 'Lastname is required' })
    .min(2, { message: 'Lastname must be at least 2 characters' })
    .max(50, { message: 'Lastname can be at most 50 characters' }),

  // Update nationalId to be a string with length check
  nationalId: z.string()
    .length(16, { message: 'National ID must be exactly 16 characters' })
    .regex(/^\d+$/, { message: 'National ID must contain only numbers' }),

  telephone: z.string()
    .min(10, { message: 'Telephone must be at least 10 digits' })
    .max(15, { message: 'Telephone can be at most 15 digits' }),

  email: z.string()
    .email({ message: 'Invalid email format' })
    .nonempty({ message: 'Email is required' })
    .min(5, { message: 'Email must be at least 5 characters' })
    .max(100, { message: 'Email can be at most 100 characters' }),

  department: z.string()
    .min(1, { message: 'Department must be at least 1 character' })
    .nonempty({ message: 'Department is required' }),

  position: z.string()
    .min(1, { message: 'Position must be at least 1 character' })
    .nonempty({ message: 'Position is required' }),

  manufacturer: z.string()
    .min(1, { message: 'Manufacturer must be at least 1 character' })
    .nonempty({ message: 'Manufacturer is required' }),

  model: z.string()
    .min(1, { message: 'Model is required' })
    .nonempty({ message: 'Model is required' }),

  serialNumber: z.string()
    .min(1, { message: 'Serial number is required' })
    .nonempty({ message: 'Serial number is required' }),
});
