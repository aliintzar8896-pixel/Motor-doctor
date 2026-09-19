import { Router } from 'express';
import authRoutes from './authRoutes.js';
import mechanicRoutes from './mechanicRoutes.js';
import requestRoutes from './requestRoutes.js';
import billRoutes from './billRoutes.js';
import contactRoutes from './contactRoutes.js';
import config from '../config/env.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Motor Doctor Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// CORS addresses inspection route
router.get('/cors-addresses', (req, res) => {
  res.json({
    status: 'active',
    allowedOrigins: config.ALLOWED_ORIGINS,
  });
});

// API modules
router.use('/auth', authRoutes);
router.use('/mechanics', mechanicRoutes);
router.use('/requests', requestRoutes);
router.use('/bill', billRoutes);
router.use('/contact', contactRoutes);

export default router;
