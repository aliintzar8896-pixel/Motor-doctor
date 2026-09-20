import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import config from './config/env.js';
import { connectDB } from './config/db.js';
import corsMiddleware from './middleware/corsMiddleware.js';
import authMiddleware from './middleware/authMiddleware.js';
import errorHandler from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Database initialization
await connectDB();

// Global Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

// Root Status Route (for Render health check and root inspection)
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    service: 'Motor Doctor Backend API',
    environment: config.NODE_ENV,
    allowedCorsOrigins: config.ALLOWED_ORIGINS,
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api', apiRoutes);

// In production or if built frontend exists, serve frontend static assets
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
const isFrontendBuilt = fs.existsSync(frontendDistPath);

if (config.NODE_ENV === 'production' || isFrontendBuilt) {
  if (isFrontendBuilt) {
    console.log(`📦 Serving static frontend from: ${frontendDistPath}`);
    app.use(express.static(frontendDistPath));

    // Client-side routing fallback
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
  } else {
    console.log('ℹ️ Frontend dist not found; backend serving API endpoints only.');
    app.get('/', (req, res) => {
      res.json({
        status: 'online',
        service: 'Motor Doctor API Server',
        environment: config.NODE_ENV,
        endpoints: '/api',
      });
    });
  }
} else {
  // Development root status fallback
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      service: 'Motor Doctor Backend API (Development Mode)',
      frontendDevUrl: 'http://localhost:8080',
      apiDocs: '/api/health',
      timestamp: new Date().toISOString(),
    });
  });
}

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.PORT;
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Motor Doctor Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
  console.log('🌐 Configured CORS Whitelist:');
  config.ALLOWED_ORIGINS.forEach(origin => console.log(`   - ${origin}`));
  console.log('====================================================');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`⚠️ Port ${PORT} is already in use by another process. Please close it or change PORT in .env`);
  } else {
    console.error('Server error:', err);
  }
});

export default app;
