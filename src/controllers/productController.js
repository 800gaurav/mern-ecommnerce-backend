const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const parseCommaValues = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const buildSort = (sort) => {
  const sortMap = {
    price_low_high: { price: 1 },
    price_high_low: { price: -1 },
    newest: { createdAt: -1 },
    top_rated: { rating: -1, createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  };

  return sortMap[sort] || sortMap.newest;
};

const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 9,
    search = "",
    category,
    brand,
    minPrice,
    maxPrice,
    rating,
    inStock,
    sort = "newest",
  } = req.query;

  const query = {};

  if (search && String(search).trim()) {
    const safeSearch = String(search).trim();
    query.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { description: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const categories = parseCommaValues(category);
  if (categories.length) {
    query.category = { $in: categories };
  }

  const brands = parseCommaValues(brand);
  if (brands.length) {
    query.brand = { $in: brands };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice !== undefined && minPrice !== "") {
      query.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== "") {
      query.price.$lte = Number(maxPrice);
    }
  }

  if (rating !== undefined && rating !== "") {
    query.rating = { $gte: Number(rating) };
  }

  if (String(inStock).toLowerCase() === "true") {
    query.stock = { $gt: 0 };
  }

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 9, 1), 50);
  const skip = (pageNumber - 1) * limitNumber;
  const sortQuery = buildSort(sort);

  const [products, totalCount, categoriesList, brandsList] = await Promise.all([
    Product.find(query).sort(sortQuery).skip(skip).limit(limitNumber).lean(),
    Product.countDocuments(query),
    Product.distinct("category"),
    Product.distinct("brand"),
  ]);

  const totalPages = Math.ceil(totalCount / limitNumber) || 1;

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalCount,
      totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPrevPage: pageNumber > 1,
    },
    filters: {
      categories: categoriesList.sort(),
      brands: brandsList.sort(),
    },
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

const getAdminProducts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 25, 1), 100);
  const search = String(req.query.search || "").trim();
  const skip = (page - 1) * limit;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }

  const [products, totalCount] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit) || 1,
    },
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const productData = { ...req.body };
  
  if (req.files && req.files.length > 0) {
    productData.images = req.files.map(file => `/uploads/products/${file.filename}`);
  }
  
  const product = await Product.create(productData);
  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    data: product,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  const updateData = { ...req.body };
  
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
    updateData.images = [...(product.images || []), ...newImages];
  }

  Object.assign(product, updateData);
  const updatedProduct = await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    data: updatedProduct,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product deleted successfully.",
  });
});

module.exports = {
  getProducts,
  getProductById,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
