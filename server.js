import express from "express";
import connectDB from "./db.js";
import repairRoutes from "./routes/repairRoutes.js"; // ✅ Import the routes
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middlewares/errorMiddleware.js";
import dotenv from "dotenv";
import sendWhatsAppMessage from "./whatsappService.js";

dotenv.config();

// Initialize Express app
const app = express();

connectDB();

// Security & Middleware
app.use(helmet()); // 🛡️ Security headers
app.use(morgan("dev")); // 📜 Logging
app.use(express.json()); // ✅ Parses JSON request body

// ✅ Apply CORS Before Routes
const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"], // ✅ Add OPTIONS for preflight
    allowedHeaders: ["Content-Type"],
    credentials: true, // ✅ Needed if sending cookies/auth
  })
);

// ✅ Allow OPTIONS preflight requests
app.options("*", cors());

// ✅ Rate Limiting AFTER CORS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable old headers
});
app.use(limiter);

// ✅ Use Routes AFTER Middleware
app.use("/api/repairs", repairRoutes);

// Root route for testing
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// Use the global error handler (must be placed after routes)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
