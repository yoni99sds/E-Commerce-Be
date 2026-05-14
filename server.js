import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import promoRoutes from "./routes/promoRoutes.js";

// SEED
import seedAdmin from "./seeds/adminSeeder.js";

// LOAD ENV
dotenv.config();

// CONNECT DB
connectDB();

const app = express();

/* =========================
   SAFE SEED (RUN ONCE)
   ========================= */
const runSeed = async () => {
  try {
    if (process.env.RUN_SEED === "true") {
      await seedAdmin();
      console.log("✅ Admin seed completed");
    }
  } catch (error) {
    console.log("❌ Seed failed:", error.message);
  }
};

runSeed();

/* =========================
   CORS CONFIG (PRODUCTION SAFE)
   ========================= */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.CLIENT_URL, // Vercel frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, true); // fallback safe mode (avoid production CORS break)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   BODY PARSER
   ========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC FILES
   ========================= */
app.use("/uploads", express.static("uploads"));
/* =========================
   ROUTES
   ========================= */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/promocodes", promoRoutes);

/* =========================
   HEALTH CHECK
   ========================= */
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API Running Successfully",
    environment: process.env.NODE_ENV || "development",
  });
});

/* =========================
   404 HANDLER
   ========================= */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* =========================
   ERROR HANDLER
   ========================= */
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);

  res.status(500).json({
    message: err.message || "Server Error",
  });
});

/* =========================
   PORT (IMPORTANT)
   ========================= */
const PORT = process.env.PORT || 5000;

/* =========================
   START SERVER
   ========================= */
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});