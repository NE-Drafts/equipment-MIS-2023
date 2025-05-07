// src/middleware/cors.ts
import cors from 'cors';

const allowedOrigins = ['http://localhost:3000']; // Add your frontend URLs here

export const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default cors(corsOptions);
