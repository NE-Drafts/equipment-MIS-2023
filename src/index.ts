import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employee.routes'; 
import corsMiddleware from './middlewares/cors.middleware';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(corsMiddleware);
app.use(cors({ origin: '*' }));
app.use(express.json());

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
