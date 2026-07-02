const router =require("express").Router();
const {createParlour, getParlours, updateParlour, deleteParlour, getNearbyParlours}=require("../Controllers/BeautyParlourController");
const { createBooking, getUserBookings, getParlourBookings, updateBookingStatus, savePayment } = require("../Controllers/BookingController");
const authMiddleware =require("../Middleware/authMiddleware");

router.post("/",createParlour)
router.get("/",getParlours)
router.put("/:id",updateParlour)
router.delete("/:id",deleteParlour)
router.get("/nearby",getNearbyParlours)
router.post("/create",createBooking);
router.get("/user/:userId",getUserBookings)
router.get("/parlour/:parlourId",getParlourBookings)
router.put("/status/:id",updateBookingStatus)
router.put("/payment/:id",savePayment);
module.exports =router;