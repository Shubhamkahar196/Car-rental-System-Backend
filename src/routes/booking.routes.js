import express from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import {createBooking, getBooking,updateBooking,deleteBooking } from '../controllers/Booking.controller';
const router = express.Router();

router.post("/create",authMiddleware,createBooking);
router.get("/get/:id",authMiddleware,getBooking);
router.put("/:id",authMiddleware,updateBooking);
router.delete("/:id",authMiddleware,deleteBooking);

export default router;
