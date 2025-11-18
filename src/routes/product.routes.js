const express = require("express");
const {
  userAuthMiddleware,
  sellerAuthMiddleware,
} = require("../middleware/auth.middleware");
const {
  userProductController,
  createProductController,
  getSellerProductController,
} = require("../controllers/productcontroller");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/userProduct", userAuthMiddleware, userProductController);
router.post(
  "/createProduct",
  sellerAuthMiddleware,
  upload.single("image"),
  createProductController
);
router.get("/getProduct", sellerAuthMiddleware, getSellerProductController);
module.exports = router;
