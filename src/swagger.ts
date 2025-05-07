import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Employee Management API',
      version: '1.0.0',
      description: 'API for managing employees and equipment distribution',
    },
    servers: [
      {
        url: 'http://localhost:5050',
      },
    ],
    components: {
      schemas: {
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
  },
  apis: ['./src/routes/*.ts'], // <- Adjust this to where your route files are
};
