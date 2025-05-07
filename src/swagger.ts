import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Employee Management API',
      version: '1.0.0',
      description: 'API for managing employees and equipment distribution',
      contact: {
        name: 'Your Name',
        email: 'you@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5050',
        description: 'Local server',
      },
    ],
    tags: [
      {
        name: 'auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'employees',
        description: 'Employee management endpoints',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterUser: {
          type: 'object',
          required: ['name', 'email', 'password', 'confirmPassword'],
          properties: {
            name: {
              type: 'string',
              example: 'Jane Doe',
              description: 'Full name of the user',
            },
            email: {
              type: 'string',
              example: 'janedoe@example.com',
              description: 'Valid email address',
            },
            password: {
              type: 'string',
              example: 'StrongP@ss1',
              description: 'Must include at least one uppercase letter, one number, and one special character',
            },
            confirmPassword: {
              type: 'string',
              example: 'StrongP@ss1',
              description: 'Must match the password',
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'EMPLOYEE'],
              example: 'EMPLOYEE',
              description: 'User role',
            },
          },
        },
        LoginUser: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'janedoe@example.com' },
            password: { type: 'string', example: 'StrongP@ss1' },
          },
        },
        Employee: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1' },
            firstname: { type: 'string', example: 'John' },
            lastname: { type: 'string', example: 'Doe' },
            nationalId: { type: 'string', example: '1234567890123456' },
            telephone: { type: 'string', example: '0781234567' },
            email: { type: 'string', example: 'johndoe@example.com' },
            department: { type: 'string', example: 'Engineering' },
            position: { type: 'string', example: 'Software Engineer' },
            manufacturer: { type: 'string', example: 'ABC Corp' },
            model: { type: 'string', example: 'Model A1' },
            serialNumber: { type: 'string', example: 'SN123456789' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};
