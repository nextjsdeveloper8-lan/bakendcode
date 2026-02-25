const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  
  otpSend,
 verifyotp,
 address,
 login,
 updateUser
  
} = require("../controllers/userController");

router.post("/user", createUser);
router.post("/user", updateUser);
router.post("/otp-send", otpSend);
router.post("/verify-otp", verifyotp);
router.post("/login", login);

router.post("/address", address);
router.post("/users", getUsers);


module.exports = router;
