import Product from "../models/Product.js";
import mongoose from 'mongoose';

// =======================
// GET ALL PRODUCTS
// =======================
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET SINGLE PRODUCT
// =======================
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// CREATE PRODUCT (WITH IMAGE UPLOAD)
// =======================
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
    } = req.body;

    const imageUrl = req.file
      ? `http://https://e-commerce-be-34qn.onrender.com/uploads/${req.file.filename}`
      : "";

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// UPDATE PRODUCT (WITH OPTIONAL IMAGE)
// =======================
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, description, price, stock, category } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);

    // ✅ FIX STOCK ALWAYS
    if (stock !== undefined && stock !== "") {
      product.stock = Number(stock);
    }

    // ✅ FIX CATEGORY (PREVENT BSON ERROR)
    if (
      category &&
      category !== "null" &&
      mongoose.Types.ObjectId.isValid(category)
    ) {
      product.category = category;
    }

    // IMAGE UPDATE
    if (req.file) {
      product.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

// =======================
// DELETE PRODUCT
// =======================
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};