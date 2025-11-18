const uploadImage = require("../services/storage.service");
const { productValidatorSchema } = require("../validators/product.validator");
const productModel = require("../models/product.model");
const { nanoid } = require("nanoid");
const redis = require("../config/redis");

const userProductController = async (req, res) => {
  res.status(200).json({
    message: req.user,
  });
};

const createProductController = async (req, res) => {
  const seller = req.seller;
  try {
    const {
      title,
      category,
      description,
      amount,
      currency = "INR",
      stocks,
    } = req.body;
    const file = req.file;
    const price = {
      amount: Number(amount),
      currency: currency,
    };

    const stock = Number(stocks);

    let imageUrl = "";
    if (file) {
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Only image files allowed" });
      }
      const result = await uploadImage(file.buffer, nanoid());
      imageUrl = result.url;
    }

    const validatedProduct = productValidatorSchema.parse({
      imageUrl,
      title,
      category,
      description,
      price,
      stock,
    });

    const product = await productModel.create({
      imageUrl: validatedProduct.imageUrl,
      title: validatedProduct.title,
      category: validatedProduct.category,
      description: validatedProduct.description,
      price: validatedProduct.price,
      stock: validatedProduct.stock,
      createdBy: seller._id,
    });

    if (!product) {
      return res.status(400).json({
        message: "Failed to create product! retry",
      });
    }
    res.status(200).json({
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getSellerProductController = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { limit = 10, cursor, category, minPrice, maxPrice } = req.query;

    const cacheKey =
      `seller:${sellerId}:products:` +
      `${cursor || "null"}:${limit}:` +
      `${category || "all"}:` +
      `${minPrice || "0"}:${maxPrice || "max"}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    let filter = { createdBy: sellerId };

    if (cursor) {
      filter.createdAt = { $lt: new Date(cursor) };
    }

    if (category) filter.category = category;

    if (minPrice || maxPrice) {
      filter["price.amount"] = {};
      if (minPrice) filter["price.amount"].$gte = Number(minPrice);
      if (maxPrice) filter["price.amount"].$lte = Number(maxPrice);
    }

    const products = await productModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    let nextCursor = null;
    if (products.length > 0) {
      nextCursor = products[products.length - 1].createdAt;
    }

    const responseData = {
      data: products,
      nextCursor,
      hasMore: products.length === Number(limit),
    };

    await redis.setEx(cacheKey, 60, JSON.stringify(responseData));

    res.status(200).json(responseData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  userProductController,
  createProductController,
  getSellerProductController,
};
