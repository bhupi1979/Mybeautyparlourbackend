const router =require("express").Router();


const authMiddleware =require("../Middleware/authMiddleware");


const {sendOtp,verifyOtp,register,getProfile}=require("../Controllers/authControllers"
)
router.get(
  "/profile",
  authMiddleware,
  getProfile
);
router.post(
"/sendotp",
sendOtp
);

router.post(
"/verifyotp",
verifyOtp
);

router.post(
"/register",
register
);

module.exports = router;