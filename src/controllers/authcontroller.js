const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userValidator } = require("../validators/user.validator");
const userModel = require("../models/user.register");
const sellerModel = require("../models/seller.register");
const { sellerValidator } = require("../validators/seller.validator");
const { loginValidator } = require("../validators/auth.validator");
const redis = require("../config/redis");

const token = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};

const userRegisterController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
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
      role,
    });

    if (user) {
      res.status(200).json({
        message: "Register Successfull",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: error.errors,
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
      role,
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

    const filters = [
      { email: validatedSeller.email },
      { storeName: validatedSeller.storeName },
      { phone: validatedSeller.phone },
    ];

    if (validatedSeller.sellerGst) {
      filters.push({ sellerGst: validatedSeller.sellerGst });
    }

    const existingSeller = await sellerModel.findOne({ $or: filters });

    if (existingSeller) {
      return res.status(400).json({
        message: "Seller already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(validatedSeller.password, 10);

    const seller = await sellerModel.create({
      name: validatedSeller.name,
      email: validatedSeller.email,
      storeName: validatedSeller.storeName,
      storeAddress: validatedSeller.storeAddress,
      phone: validatedSeller.phone,
      storeDescription: validatedSeller.storeDescription,
      storeLogo: validatedSeller.storeLogo,
      sellerGst: validatedSeller.sellerGst,
      password: hashedPassword,
      role,
    });

    if (seller) {
      res.status(200).json({
        message: "Seller Registered",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: error.errors,
    });
  }
};

const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validatedUser = loginValidator.parse({ email, password });

    const existingUser = await userModel
      .findOne({
        email: validatedUser.email,
      })
      .select("_id password");

    if (!existingUser) {
      return res.status(401).json({
        message: "User Does Not Exist!",
      });
    }

    const hashedPassword = await bcrypt.compare(
      validatedUser.password,
      existingUser.password
    );

    if (!hashedPassword) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const tokenId = token(existingUser._id);

    res.status(200).json({
      message: "Login Successful",
      tokenId,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.errors,
    });
  }
};

const sellerLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validatedSeller = loginValidator.parse({ email, password });

    const existingSeller = await sellerModel
      .findOne({
        email: validatedSeller.email,
      })
      .select("_id password");

    if (!existingSeller) {
      return res.status(401).json({
        message: "Seller Does Not Exist",
      });
    }

    const hashedPassword = await bcrypt.compare(
      validatedSeller.password,
      existingSeller.password
    );

    if (!hashedPassword) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const tokenId = token(existingSeller._id);
    res.status(200).json({
      message: "Login Successful",
      tokenId,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.errors,
    });
  }
};

const logoutController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorise access",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const isBlacklisted = await redis.set(
      `blacklist:${token}`,
      "true",
      "EX",
      24 * 60 * 60
    );
    if (isBlacklisted) {
      return res
        .status(401)
        .json({ message: "Session expired, please login again" });
    }

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.stauts(500).json({
      message: error.errors,
    });
  }
};

module.exports = {
  userRegisterController,
  sellerRegisterController,
  userLoginController,
  sellerLoginController,
  logoutController,
};
