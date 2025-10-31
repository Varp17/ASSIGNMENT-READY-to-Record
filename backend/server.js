const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth");
const taskRoutes = require("./src/routes/tasks");

dotenv.config();
connectDB();

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());


const allowedOrigins = [
  process.env.CLIENT_URL,             // Vercel site
  "http://localhost:3000",            // React dev server
  "http://localhost:5173"             // Vite dev server
];

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend running successfully",
    clientURL: CLIENT_URL,
  });
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}\n🧭 Client: ${CLIENT_URL}`)
);
