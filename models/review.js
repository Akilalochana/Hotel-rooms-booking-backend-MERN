import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false
  },
  profilePicture: {
    type: String,
    required: true,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
});


const Review = mongoose.model("reviewsss", reviewSchema);

export default Review;