# Motor Doctor – 24x7 Roadside Assistance & Service Bill Doctor

A full-stack intelligent automotive assistance and billing verification web platform for highway drivers, breakdown recovery, and auto repair cost advisory.

---

## 🏗️ Architecture & Project Structure

The project has been reorganized into a clean, decoupled architecture:

```
Motor-Doctor/
│
├── frontend/                     # React + Vite + TypeScript Frontend
│   ├── public/                   # Static assets & verification files
│   ├── src/
│   │   ├── assets/               # Images, diagrams, and illustrations
│   │   ├── components/           # Reusable UI components
│   │   │   ├── bill-doctor/      # Bill review & consultation modals
│   │   │   ├── emergency/        # SOS trigger & breakdown modal
│   │   │   ├── layout/           # Navbar, Footer
│   │   │   ├── map/              # Leaflet emergency mechanic map
│   │   │   ├── mechanic/         # Mechanic profile cards
│   │   │   ├── payment/          # Razorpay / UPI / Cash payment selector
│   │   │   └── tracking/         # Live ETA & mechanic tracking card
│   │   ├── context/              # Global AppContext state provider
│   │   ├── pages/                # Page routes (Home, Emergency, Portal, etc.)
│   │   ├── services/             # Dedicated API service layer
│   │   │   ├── api.ts            # Central API client
│   │   │   ├── authService.ts    # Authentication API calls
│   │   │   ├── mechanicService.ts# Mechanic directory & status calls
│   │   │   ├── requestService.ts # Service requests & dispatch calls
│   │   │   ├── billService.ts    # AI bill analysis & consultation calls
│   │   │   └── contactService.ts # Contact form submission calls
│   │   ├── utils/                # Helper utilities, audio alerts & mock seeds
│   │   ├── types/                # TypeScript interface definitions
│   │   ├── App.tsx               # Main application component & routes
│   │   ├── main.tsx              # Application DOM entry point
│   │   └── index.css             # Tailwind CSS & design tokens
│   ├── index.html                # HTML entry point with Leaflet & Google Fonts
│   ├── vite.config.ts            # Vite build & local API proxy configuration
│   ├── tailwind.config.ts        # Tailwind styling theme
│   ├── tsconfig.json             # TypeScript configuration
│   ├── package.json              # Frontend dependencies and scripts
│   └── .env.example              # Frontend environment template
│
├── backend/                      # Express.js REST API Server
│   ├── config/
│   │   ├── env.js                # Environment variable configuration
│   │   └── db.js                 # Database connection & in-memory store
│   ├── controllers/              # Request handlers and business logic
│   │   ├── authController.js     # User login & registration
│   │   ├── mechanicController.js # Mechanic directory & verification
│   │   ├── requestController.js  # Emergency requests & live tracking
│   │   ├── billController.js     # Bill analysis & advisor consultations
│   │   └── contactController.js  # Contact inquiries
│   ├── models/                   # Data models & business rules
│   │   ├── User.js               # Driver, mechanic, and admin schema
│   │   ├── Mechanic.js           # Mechanic profile schema
│   │   ├── ServiceRequest.js     # Service request lifecycle schema
│   │   └── BillItem.js           # Repair bill pricing analysis model
│   ├── middleware/
│   │   ├── corsMiddleware.js     # Dynamic CORS origin handler
│   │   ├── authMiddleware.js     # JWT & session authentication
│   │   └── errorHandler.js       # Centralized error handler
│   ├── routes/                   # Express route definitions
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── mechanicRoutes.js     # /api/mechanics
│   │   ├── requestRoutes.js      # /api/requests
│   │   ├── billRoutes.js         # /api/bill
│   │   ├── contactRoutes.js      # /api/contact
│   │   └── index.js              # Combined API router & health endpoints
│   ├── services/
│   │   └── externalServices.js   # Razorpay & third-party integrations
│   ├── utils/
│   │   └── helpers.js            # OTP generator, currency formatters
│   ├── server.js                 # Express server & static frontend hosting
│   ├── package.json              # Backend dependencies and scripts
│   └── .env.example              # Backend environment template
│
├── .env.example                  # Root environment variable template
├── .gitignore                    # Git ignore file
├── render.yaml                   # Render Blueprint deployment configuration
├── start_motor_doctor.bat        # Windows one-click local launch script
└── package.json                  # Root monorepo orchestration scripts
```

---

## 🚀 Quick Start (Local Development)

### Option A: Using Windows Batch Script
Double click or run:
```cmd
start_motor_doctor.bat
```
This automatically launches:
1. Backend API server on `http://localhost:5000`
2. Frontend Vite dev server on `http://localhost:8080`
3. Opens your default web browser to `http://localhost:8080/`

### Option B: Using npm commands

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Run both Frontend and Backend concurrently:**
   ```bash
   npm run dev
   ```

3. **Or run individually:**
   ```bash
   # Terminal 1 (Backend)
   npm run dev:backend

   # Terminal 2 (Frontend)
   npm run dev:frontend
   ```

---

## ☁️ Deployment on Render

### Option 1: Unified Web Service (Recommended)
This deploys both the frontend and backend in a single Render Web Service. The Express server serves the built frontend SPA in production:

1. Connect your repository to **Render**.
2. Create a new **Web Service**.
3. Set the following settings:
   - **Root Directory**: *(leave blank)*
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (or leave default assigned by Render)
   - `ALLOWED_ORIGINS` = `https://<your-render-service-name>.onrender.com`

---

### Option 2: Decoupled Services (Separate Backend & Frontend)

#### 1. Backend Web Service
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV` = `production`
  - `PORT` = `10000`
  - `ALLOWED_ORIGINS` = `https://<your-frontend-domain>.onrender.com`

#### 2. Frontend Static Site
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL` = `https://<your-backend-domain>.onrender.com`

---

## 🔑 Environment Variables Reference

| Variable | Scope | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend | Port number for Express server | `5000` (local), `10000` (Render) |
| `NODE_ENV` | Backend | Environment mode | `development` / `production` |
| `ALLOWED_ORIGINS` | Backend | Comma-separated CORS allowed origins | `http://localhost:8080,https://motordoctor.in` |
| `VITE_API_URL` | Frontend | Base URL for API requests | Empty string (uses relative `/api`) or full URL |
| `RAZORPAY_KEY_ID` | Backend | Razorpay API Key ID | Optional / Production |
| `RAZORPAY_KEY_SECRET`| Backend | Razorpay API Secret | Optional / Production |
| `DATABASE_URL` | Backend | Database connection URI | Optional (uses seeded in-memory store if blank) |
