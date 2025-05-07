import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employee.routes'; 
import corsMiddleware from './middlewares/cors.middleware';
import { errorHandler } from './middlewares/errorHandler';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { setupSwagger } from './swagger/components'; // Adjust the import path as necessary
import { swaggerOptions } from './swagger'; // adjust path if needed

const specs = swaggerJSDoc(swaggerOptions);
// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Employee Management API',
    version: '1.0.0',
    description: 'API documentation for managing employees and their equipment',
    contact: {
      name: 'Your Name',
      email: 'your-email@example.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5050', // Update this to match your server URL
      description: 'Local server',
    },
  ],
};

// Options for the Swagger docs
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Adjust paths according to your project structure
};
// Initialize SwaggerJSdoc
const swaggerSpec = swaggerJSDoc(options);
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
setupSwagger(app);
app.use(corsMiddleware);
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.urlencoded({ extended: true }));
// ✅ Routes should come before error handler
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// ✅ Optional: Catch-all route
app.use('/{*splat}', (req, res) => {
  res.status(404).json({
    status: 404,
    success: false,
    message: 'Route not found'
  });
});

// ✅ Error handler comes LAST
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
