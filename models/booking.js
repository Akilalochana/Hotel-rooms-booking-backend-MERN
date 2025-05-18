import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  bookingId:{
    type: String,
    required: true,
    unique: true
  },
  email:{
    type: String,
    required: true,
  }, 
  bookingDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  bookingItems :{

    type:[
      {
        product:{
          key: {
            type: String,
            required: true
          },
          name: {
            type: String,
            required: true
          },
          image: {
            type: String,
            required: true
          },
          price:{
            type: Number,
            required: true
          }
        }
      }
    ],
    required: true


  },
  days:{
    type: Number,
    required: true
  },
  startingDate:{
    type: Date,
    required: true
  },
  endingDate:{
    type: Date,
    required: true
  },
  isApproved:{
    type: Boolean,
    required: true,
    default: false
  },
  price:{
    type: Number,
    required: true
  }


})

const Booking  = mongoose.model("Bookingssss", bookingSchema);
export default Booking;