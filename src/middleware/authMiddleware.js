const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    res.status(401);
    return next(new Error("Not authorized. Token missing."));
  }

  const token = authorization.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      res.status(401);
      return next(new Error("Not authorized. User does not exist."));
    }

    if (user.isBlocked) {
      res.status(403);
      return next(new Error("Your account has been blocked. Contact support."));
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Not authorized. Invalid token."));
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error("Forbidden. You do not have access to this resource."));
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    return next(new Error("Admin access required."));
  }
  next();
};

module.exports = {
  protect,
  authorize,
  adminOnly,
};
