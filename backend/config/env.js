import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dotenvLoaded = false;
try {
  const dotenv = await import('dotenv');
  dotenv.default.config({ path: path.resolve(__dirname, '../.env') });
  dotenv.default.config({ path: path.resolve(__dirname, '../../.env') });
  dotenvLoaded = true;
} catch (e) {
  // dotenv not installed; standard process.env will be used
}

export const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ALLOWED_ORIGINS: [...new Set([
    ...(process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
      : [
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://motordoctor.in',
      ]),
    'https://enchanting-clafoutis-d2ca0b.netlify.app',
  ])],
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'motor_doctor_secret_jwt_key_2026',

  // Nodemailer SMTP Email Notification Configuration
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || (process.env.SMTP_USER ? `"Motor Doctor 24x7" <${process.env.SMTP_USER}>` : '"Motor Doctor 24x7" <no-reply@motordoctor.in>'),
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'aliintzar8896@gmail.com',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Intzar Ali',
};

export default config;
