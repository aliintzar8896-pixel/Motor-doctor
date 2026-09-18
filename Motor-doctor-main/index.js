import express from "express";
import cors from "cors";

const app = express();

// Allowed CORS origins / addresses for frontend access
const allowedOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://motordoctor.in"
];

// Support additional custom origins via environment variables
if (process.env.ALLOWED_ORIGINS) {
  const envOrigins = process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim());
  allowedOrigins.push(...envOrigins);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman, or local scripts)
    if (!origin) return callback(null, true);

    // Allow predefined whitelist or any localhost / 127.0.0.1 port in development
    const isAllowed = allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (isAllowed) {
      return callback(null, true);
    } else {
      const msg = `CORS Error: Origin ${origin} is not allowed by CORS policy.`;
      return callback(new Error(msg), false);
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test / Status route
app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "Motor Doctor Backend API",
    allowedCorsOrigins: allowedOrigins,
    timestamp: new Date().toISOString()
  });
});

// Route to inspect allowed CORS addresses
app.get("/api/cors-addresses", (req, res) => {
  res.json({
    status: "active",
    allowedOrigins
  });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("=========================================");
  console.log(`🚀 Motor Doctor Server running on port ${PORT}`);
  console.log("🌐 Configured CORS Addresses / Origins:");
  allowedOrigins.forEach(addr => console.log(`   - ${addr}`));
  console.log("=========================================");
});