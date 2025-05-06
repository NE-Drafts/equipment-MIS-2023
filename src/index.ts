import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employee.routes'; 
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ This is correct
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
}
);
// Catch-all route after all other routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
    
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
