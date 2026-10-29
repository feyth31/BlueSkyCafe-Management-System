
const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");
const {
  verifyToken,
  allowRoles,
} = require("../middleware/authMiddleware");

// Create a new order
// All logged-in roles can create orders
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item.",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    // Check products and calculate order total
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: "Product not found.",
        });
      }

      if (item.quantity < 1 || item.quantity > product.stock) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.productName}.`,
        });
      }

      const subtotal = product.price * item.quantity;

      orderItems.push({
        product: product._id,
        productName: product.productName,
        price: product.price,
        quantity: item.quantity,
        subtotal,
      });

      totalAmount += subtotal;
    }

    // Deduct stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Save order
    const order = await Order.create({
      items: orderItems,
      totalAmount,
    });

    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);

    res.status(500).json({
      message: "Server error while creating order.",
    });
  }
});

// Get sales and reports data
// Only Manager and Administrator can access this endpoint
router.get(
  "/reports",
  verifyToken,
  allowRoles("Manager", "Administrator"),
  async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });

      res.json({ orders });
    } catch (error) {
      console.error("Error fetching reports:", error);

      res.status(500).json({
        message: "Error fetching reports.",
      });
    }
  }
);

// Get all orders
// All logged-in roles can view order history
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders.",
    });
  }
});

module.exports = router;
