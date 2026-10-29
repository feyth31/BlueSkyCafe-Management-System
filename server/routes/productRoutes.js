
const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

// GET: View all products
// All logged-in roles can view products
router.get("/", verifyToken, async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products.",
    });
  }
});

// POST: Add a product
// Only Manager and Administrator
router.post(
  "/",
  verifyToken,
  allowRoles("Manager", "Administrator"),
  async (req, res) => {
    try {
      const { productName, category, price, stock, description } = req.body;

      const newProduct = await Product.create({
        productName,
        category,
        price,
        stock,
        description,
      });

      res.status(201).json({
        success: true,
        message: "Product added successfully.",
        product: newProduct,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to add product.",
        error: error.message,
      });
    }
  }
);

// PUT: Update a product
// Only Manager and Administrator
router.put(
  "/:id",
  verifyToken,
  allowRoles("Manager", "Administrator"),
  async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        product: updatedProduct,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to update product.",
        error: error.message,
      });
    }
  }
);

// DELETE: Remove a product
// Only Manager and Administrator
router.delete(
  "/:id",
  verifyToken,
  allowRoles("Manager", "Administrator"),
  async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);

      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to delete product.",
        error: error.message,
      });
    }
  }
);

module.exports = router;
