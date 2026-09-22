import cors from 'cors';
import config from '../config/env.js';

export const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman, or local scripts)
    if (!origin) return callback(null, true);

    // Allow predefined whitelist or any localhost / 127.0.0.1 port in development
    const isAllowed =
      config.ALLOWED_ORIGINS.includes(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
      /\.onrender\.com$/.test(origin);

    if (isAllowed) {
      return callback(null, true);
    } else {
      const msg = `CORS Error: Origin ${origin} is not allowed by CORS policy.`;
      return callback(new Error(msg), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200,
};

export const corsMiddleware = cors(corsOptions);
export default corsMiddleware;
