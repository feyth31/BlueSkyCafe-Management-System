
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

/* USER LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Please enter your username and password",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
});

/* GET ALL USERS */
router.get(
  "/",
  verifyToken,
  allowRoles("Administrator"),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      console.error("Fetch users error:", error);

      res.status(500).json({
        message: "Failed to fetch users",
      });
    }
  }
);

/* ADD A USER */
router.post(
  "/",
  verifyToken,
  allowRoles("Administrator"),
  async (req, res) => {
    try {
      const { fullName, username, email, password, role } = req.body;

      if (!fullName || !username || !email || !password || !role) {
        return res.status(400).json({
          message: "Please complete all fields",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = await User.findOne({
        $or: [
          { username: username.trim() },
          { email: normalizedEmail },
        ],
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Username or email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        fullName: fullName.trim(),
        username: username.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role,
      });

      res.status(201).json({
        message: "User added successfully",
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error("Add user error:", error);

      res.status(500).json({
        message: "Failed to add user",
      });
    }
  }
);

/* UPDATE A USER */
router.put(
  "/:id",
  verifyToken,
  allowRoles("Administrator"),
  async (req, res) => {
    try {
      const { fullName, username, email, role, password } = req.body;

      const normalizedEmail = email
        ? email.trim().toLowerCase()
        : email;

      // Check whether another account already uses this username or email
      const existingUser = await User.findOne({
        _id: { $ne: req.params.id },
        $or: [
          ...(username ? [{ username: username.trim() }] : []),
          ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
        ],
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Username or email already exists",
        });
      }

      const updates = {
        fullName: fullName?.trim(),
        username: username?.trim(),
        email: normalizedEmail,
        role,
      };

      if (password && password.trim() !== "") {
        updates.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updates,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update user error:", error);

      res.status(500).json({
        message: "Failed to update user",
      });
    }
  }
);

/* DELETE A USER */
router.delete(
  "/:id",
  verifyToken,
  allowRoles("Administrator"),
  async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);

      if (!deletedUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);

      res.status(500).json({
        message: "Failed to delete user",
      });
    }
  }
);

module.exports = router;
