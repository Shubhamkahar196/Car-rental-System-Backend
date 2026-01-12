import express from 'express';
import { authMiddleware } from '../middleware/authmiddleware.js';
import {createBooking, getBooking,updateBooking,deleteBooking } from '../controllers/Booking.controller.js';
const router = express.Router();

router.post("/",authMiddleware,createBooking);
router.get("/",authMiddleware,getBooking);
router.put("/:bookingId",authMiddleware, updateBooking);
router.delete("/:bookingId",authMiddleware, deleteBooking);


export default router;
