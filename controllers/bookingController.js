import Booking from "../models/booking.js";
import Product from "../models/product.js";
import { isItAdmin } from "./userController.js";

export async function createBooking(req, res) {
  const data = req.body;
  const bookingInfo = {
    bookingItems: [],
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
      booking : results
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Failed to create booking",
    });
  }
}

export async function getBookings(req, res){
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Please login and try again" });
    }

    const email = req.user.email;

    // Optional: check for admin
    const admin = await isItAdmin(req.user.email);

    if (admin) {
      const bookings = await Booking.find(); // Admin gets all bookings
      return res.status(200).json(bookings);
    } else {
      const bookings = await Booking.find({ email }); // User gets only their bookings
      if (bookings.length === 0) {
        return res.status(200).json({ message: "You haven’t booked yet.", bookings: [] });
      }
      return res.status(200).json({ bookings });
    }

  } catch (err) {
    res.status(500).json({
      error: "Booking fetching failed"
    });
  }
}
