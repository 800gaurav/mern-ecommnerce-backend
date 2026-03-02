const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(409);
    throw new Error("Email is already registered.");
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: "Registration successful.",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

const addAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const adminCount = await User.countDocuments({ role: "admin" });
  if (adminCount >= 1) {
    res.status(403);
    throw new Error("Only one admin is allowed. Admin already exists.");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(409);
    throw new Error("Email is already registered.");
  }

  const user = await User.create({ name, email, password, role: "admin" });

  res.status(201).json({
    success: true,
    message: "Admin created successfully.",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = {
  register,
  login,
  getProfile,
  addAdmin,
};
