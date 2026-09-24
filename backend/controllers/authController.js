const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// =====================================================
// REGISTER USER
// POST /api/auth/register
// =====================================================

const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
  } = req.body;

  // Required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  // Check existing user
  const existingUser = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
  });

  // Response
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// =====================================================
// LOGIN USER
// POST /api/auth/login
// =====================================================

const loginUser = asyncHandler(async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  // Required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // Find user
  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Compare password
  const isPasswordCorrect =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Create JWT
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  // Response
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
});

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  registerUser,
  loginUser,
};