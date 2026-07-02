const { createOrder, verifyPayment } = require("../Controllers/PaymentController");

const router =require("express").Router();
router.post("/create-order",createOrder);
router.post("/verify/:id",verifyPayment)
module.exports =router;