const express = require("express");
const {
  userRegisterController,
  sellerRegisterController,
  userLoginController,
  sellerLoginController,
} = require("../controllers/authcontroller");
const router = express.Router();

router.post("/userRegister", userRegisterController);
router.post("/sellerRegister", sellerRegisterController);
router.post("/userlogin", userLoginController);
router.post("/sellerLogin", sellerLoginController);

module.exports = router;
