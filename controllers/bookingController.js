import Booking from "../models/booking.js";
import Product from "../models/product.js";
import { isItAdmin } from "./userController.js";

export async function createBooking(req, res) {
  const data = req.body;
  const bookingInfo = {
    bookingItems: [],
    status: "pending" // Add default status
  };

  if (req.user == null) {
    res.status(401).json({
      message: "Please login and try again",
    });
    return;
  }

  bookingInfo.email = req.user.email;

  const lastBooking = await Booking.find().sort({ bookingDate: -1 }).limit(1);
  if (lastBooking.length === 0) {
    bookingInfo.bookingId = "ORD0001";
  } else {
    const lastBookingId = lastBooking[0].bookingId; // "ORD0065"
    const lastBookingNumberInString = lastBookingId.replace("ORD", "");// "0065"
    const lastBookingNumber = parseInt(lastBookingNumberInString); //65
    const currentOrderNumber = lastBookingNumber + 1;// 66
    const formattedNumber = String(currentOrderNumber).padStart(4, "0"); // "0066"
    bookingInfo.bookingId = "ORD" + formattedNumber;
  }

  let oneDayCost = 0;

  for (let i = 0; i < data.bookingItems.length; i++) {
    try {
      const product = await Product.findOne({ key: data.bookingItems[i].key });
      if (!product) {
        res.status(404).json({
          message: "Product with key " + data.bookingItems[i].key + " not found",
        });
        return;
      }
      if (product.availability === false) {
        res.status(400).json({
          message: "Product with key " + data.bookingItems[i].key + " is not available",
        });
        return;
      }

      bookingInfo.bookingItems.push({
        product: {
          key: product.key,
          name: product.name,
          image: product.image[0],
          price: product.price,
        },
      });

      oneDayCost += product.price;
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Failed to create order",
      });
      return;
    }
  }

  bookingInfo.days = data.days;
  bookingInfo.price = oneDayCost * bookingInfo.days;
  bookingInfo.startingDate = data.startingDate;
  bookingInfo.endingDate = data.endingDate;

  try {
    const newBooking = new Booking(bookingInfo);
    const results = await newBooking.save();
    res.json({
      message: "Booking created successfully",
      booking: results
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Failed to create booking",
    });
  }
}

export async function getBookings(req, res) {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Please login and try again" });
    }

    const email = req.user.email;

    // Check for admin - pass the req object, not just email
    const admin = isItAdmin(req);

    if (admin) {
      const bookings = await Booking.find(); // Admin gets all bookings
      return res.status(200).json({
        success: true,
        bookings: bookings,
        isAdmin: true
      });
    } else {
      const bookings = await Booking.find({ email }); // User gets only their bookings
      return res.status(200).json({
        success: true,
        bookings: bookings,
        isAdmin: false,
        message: bookings.length === 0 ? "You haven't booked yet." : undefined
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Booking fetching failed"
    });
  }
}

export async function approveOrRejectBooking(req, res) {
  const bookingId = req.params.bookingId;
  const { status, isApproved } = req.body;

  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      error: "Please login and try again"
    });
  }

  try {
    // Check if user is admin - pass the req object
    const admin = isItAdmin(req);
    console.log("Admin check result:", admin, "for user:", req.user.email, "role:", req.user.role);
    
    if (!admin) {
      return res.status(403).json({
        error: "Unauthorized - Admin access required"
      });
    }

    // Find the booking
    const booking = await Booking.findOne({
      bookingId: bookingId
    });

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found"
      });
    }

    // Determine the status to set
    let newStatus;
    if (status) {
      newStatus = status;
    } else if (isApproved !== undefined) {
      newStatus = isApproved ? "approved" : "rejected";
    } else {
      return res.status(400).json({
        error: "Status or isApproved parameter is required"
      });
    }

    // Update the booking
    await Booking.updateOne(
      {
        bookingId: bookingId
      },
      {
        status: newStatus
      }
    );

    res.json({
      message: "Booking status updated successfully",
      bookingId: bookingId,
      newStatus: newStatus
    });

  } catch (e) {
    console.error("Error in approveOrRejectBooking:", e);
    res.status(500).json({
      error: "Failed to update booking status"
    });
  }
}