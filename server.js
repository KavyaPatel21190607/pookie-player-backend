import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables FIRST before any other imports that use them
dotenv.config();

import connectDB from './config/db.js';
import { verifySupabaseConnection } from './config/supabase.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import songRoutes from './routes/songRoutes.js';

// Connect to Database
connectDB();

// Initialize Express App
const app = express();

// Middleware
// Temporarily allow all origins to avoid CORS blocking during initial deployment.
// NOTE: This is permissive and should be tightened after verification.
app.use(cors({ origin: true, credentials: true }));

// Remove explicit body size limits per user request. If you later need limits,
// reintroduce a safe `limit` value (for example '10mb').
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Pookie\'s Periodic Lyrics Player API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`💾 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
  
  // Verify Supabase connection
  await verifySupabaseConnection();
});

export default app;
