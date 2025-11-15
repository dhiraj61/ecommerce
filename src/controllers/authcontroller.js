const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userValidator } = require("../validators/user.validator");
const userModel = require("../models/user.register");
const sellerModel = require("../models/seller.register");
const { sellerValidator } = require("../validators/seller.validator");

const token = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
};

const userRegisterController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const validatedUser = userValidator.parse({ name, email, password });
    const existingUser = await userModel.findOne({
      email: validatedUser.email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Usear already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(validatedUser.password, 10);

    const user = await userModel.create({
      name: validatedUser.name,
      email: validatedUser.email,
      password: hashedPassword,
    });

    if (user) {
      const tokenid = token(user._id);
      res.status(200).json({
        tokenid,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

const sellerRegisterController = async (req, res) => {
  try {
    const {
      name,
      email,
      storeName,
      storeAddress,
      phone,
      storeDescription,
      storeLogo,
      sellerGst,
      password,
    } = req.body;
    const validatedSeller = sellerValidator.parse({
      name,
      email,
      storeName,
      storeAddress,
      phone,
      storeDescription,
      storeLogo,
      sellerGst,
      password,
    });

    console.log(validatedSeller);

    const existingSeller = await sellerModel.findOne({
      email: validatedSeller.email,
    });

    if (existingSeller) {
      return res.status(400).json({
        message: "seller already exist",
      });
    }

    const hashedPassword = bcrypt.hash(validatedSeller.password, 10);

    const seller = await sellerModel.create({
      name: validatedSeller.name,
      email: validatedSeller.email,
      storeName: validatedSeller.storeName,
      storeAddress: validatedSeller.storeAddress,
      phone: validatedSeller.phone,
      storeDescription: validatedSeller.storeDescription,
      storeLogo: validatedSeller.storeLogo,
      sellerGst: validatedSeller.sellerGst,
      password: validatedSeller.password,
    });

    if (seller) {
      const tokenid = token(seller._id);
      res.status(200).json({
        tokenid,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

module.exports = { userRegisterController, sellerRegisterController };
