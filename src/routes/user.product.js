const express = require("express");
const {
  userAuthMiddleware,
  sellerAuthMiddleware,
} = require("../middleware/auth.middleware");
const {
  userProductController,
  sellerProductController,
} = require("../controllers/productcontroller");
const router = express.Router();

router.get("/userProduct", userAuthMiddleware, userProductController);
router.get("/sellerProduct", sellerAuthMiddleware, sellerProductController);

module.exports = router;
