import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        message: "No order items provided",
      });
    }

    const fullOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        try {
          const product = await Product.findById(
            item.productId
          );

          // ✅ SAFE CHECK (NO CRASH)
          if (!product) return null;

          return {
            product: product._id,
            name: product.name,
            image: product.image || "",
            price: product.price,
            quantity: item.quantity || 1,
            priceAtPurchase: product.price,
          };
        } catch (err) {
          // never crash whole order
          return null;
        }
      })
    );

    // ✅ REMOVE INVALID ITEMS
    const validItems = fullOrderItems.filter(
      Boolean
    );

    if (validItems.length === 0) {
      return res.status(400).json({
        message:
          "No valid products found in cart",
      });
    }

    const totalAmount = validItems.reduce(
      (acc, item) =>
        acc +
        item.price *
          item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      orderItems: validItems,
      shippingAddress,
      totalAmount,
      status: "pending",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("ORDER ERROR:", error);

    res.status(500).json({
      message:
        "Failed to create order safely",
    });
  }
};
// GET USER ORDERS
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("orderItems.product");

  res.json(orders);
};

// GET ALL ORDERS (ADMIN)
export const getAllOrders = async (req, res) => {
const orders = await Order.find()
  .populate("orderItems.product", "name imageUrl price")
  .sort({ createdAt: -1 });

res.json(orders);
};

// UPDATE STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });

    // 🔥 RE-FETCH FULL ORDER WITH POPULATION
    const updatedOrder = await Order.findById(req.params.id)
      .populate("orderItems.product", "name imageUrl price");

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ORDER
export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.json({
      message: "Order deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: "orderItems.product",
        select: "name imageUrl price",
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};