import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";

// =======================
// ROUTES
// =======================
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import promoRoutes from "./routes/promoRoutes.js";

// =======================
// SEED FILE
// =======================
import seedAdmin from "./seeds/adminSeeder.js";

// =======================
// LOAD ENV
// =======================
dotenv.config();

// =======================
// CONNECT DB
// =======================
connectDB();

const app = express();

// =======================
// AUTO SEED DATABASE
// =======================
const runSeed = async () => {
  try {
    await seedAdmin();
    console.log("✅ Admin seed completed");
  } catch (error) {
    console.log("❌ Seed failed:", error.message);
  }
};

// run only once on server start
runSeed();

// =======================
// CORS
// =======================
const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS policy blocked this origin")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// =======================
// BODY PARSER
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// STATIC FILES
// =======================
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// =======================
// API ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/promocodes", promoRoutes);

// =======================
// ROOT
// =======================
app.get("/", (req, res) => {
  res.send("🚀 API Running...");
});

// =======================
// 404 HANDLER
// =======================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// =======================
// GLOBAL ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: err.message || "Server Error",
  });
});

// =======================
// PORT
// =======================
const PORT = process.env.PORT || 5000;

// =======================
// START SERVER
// =======================
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});