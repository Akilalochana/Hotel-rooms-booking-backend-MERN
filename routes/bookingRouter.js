import express from "express";
import { approveOrRejectBooking, createBooking, getBookings } from "../controllers/bookingController.js";


const  bookingRouter = express.Router();


bookingRouter.post("/", createBooking);
bookingRouter.get("/", getBookings);
bookingRouter.put("/status/:bookingId", approveOrRejectBooking);


export default bookingRouter;