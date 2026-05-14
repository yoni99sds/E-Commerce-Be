import express from "express";
import {
  validatePromo,
  createPromo,
  getPromos,
  deletePromo,
  updatePromo
} from "../controllers/promoController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/validate", validatePromo);

router.get("/", protect, admin, getPromos);
router.post("/", protect, admin, createPromo);
router.delete("/:id", protect, admin, deletePromo);
router.put("/:id", protect, admin, updatePromo);

export default router;