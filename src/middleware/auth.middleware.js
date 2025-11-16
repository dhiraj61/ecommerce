const jwt = require("jsonwebtoken");
const userModel = require("../models/user.register");
const sellerModel = require("../models/seller.register");

const userAuthMiddleware = async (req, res, next) => {
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
      return res.status(401).json({
        message: "Unauthorise Access",
      });
    }

    const user = await userModel.findOne({
      _id: decoded.id,
    });

    if (user) {
      req.user = user;
      next();
    }
  } catch (error) {
    return res.status(400).json({
      message: error.errors,
    });
  }
};

const sellerAuthMiddleware = async (req, res, next) => {
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
      return res.status(401).json({
        message: "Unauthorise access",
      });
    }

    const seller = await sellerModel.findOne({
      _id: decoded.id,
    });

    if (seller) {
      req.seller = seller;
      next();
    }
  } catch (error) {
    return res.status(401).json({
      message: error.errors,
    });
  }
};

module.exports = { userAuthMiddleware, sellerAuthMiddleware };
