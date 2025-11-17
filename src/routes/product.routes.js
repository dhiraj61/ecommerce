const express = require("express");
const {
  userAuthMiddleware,
  sellerAuthMiddleware,
} = require("../middleware/auth.middleware");
const {
  userProductController,
  createProductController,
  getProductController,
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
router.get("/getProduct", userAuthMiddleware, getProductController);
module.exports = router;
