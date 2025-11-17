const uploadImage = require("../services/storage.service");
const { productValidatorSchema } = require("../validators/product.validator");
const productModel = require("../models/product.model");
const { nanoid } = require("nanoid");

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

const getProductController = async (req, res) => {
  try {
    
    const product = await productModel.find()
    res.status(200).json({
      data:product
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = { userProductController, createProductController,getProductController };
