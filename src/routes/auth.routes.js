const express = require("express");
const {
  userRegisterController,
  sellerRegisterController,
} = require("../controllers/authcontroller");
const router = express.Router();

router.post("/userRegister", userRegisterController);
router.post("/sellerRegister", sellerRegisterController);

module.exports = router;
