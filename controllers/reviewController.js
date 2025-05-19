import Review from "../models/review.js";

// Add a new review

export async function addReview(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Please login and try again." });
  }

  try {
    const data = req.body;

    // Fill user info
    data.email = req.user.email;
    data.profilePicture = req.user.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    // Validate required fields
    if (!data.rating || !data.comment) {
      return res.status(400).json({ message: "rating and comment are required." });
    }

    // Generate review ID
    const lastReview = await Review.findOne().sort({ reviewId: -1 });
    if (!lastReview || !lastReview.reviewId) {
      data.reviewId = "REV0001";
    } else {
      const lastReviewId = lastReview.reviewId;
      const lastReviewNumberInString = lastReviewId.replace("REV", "");
      const lastReviewNumber = parseInt(lastReviewNumberInString);
      const currentReviewNumber = lastReviewNumber + 1;
      const formattedNumber = String(currentReviewNumber).padStart(4, "0");
      data.reviewId = "REV" + formattedNumber;
    }

    // // Optional: prevent duplicate reviews by same user
    // const existing = await Review.findOne({ email: data.email });
    // if (existing) {
    //   return res.status(400).json({ message: "You have already submitted a review." });
    // }

    const newReview = new Review(data);
    const results = await newReview.save();

    return res.status(201).json({
      message: "Review added successfully",
      results: results
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Review addition failed" });
  }
}


// Get all reviews
export async function getReviews(req, res) {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Review fetching failed" });
  }
}

// Delete review
export async function deleteReview(req, res) {
  const email = req.params.email;

  if (!req.user) {
    return res.status(401).json({ message: "Please login and try again." });
  }

  try {
    if (req.user.role === "admin" || req.user.email === email) {
      const result = await Review.deleteOne({ email });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Review not found." });
      }

      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(403).json({ message: "You are not authorized to delete this review" });
    }
  } catch (err) {
    res.status(500).json({ error: "Review deletion failed" });
  }
}

// Approve review
export async function approveReview(req, res) {
  const email = req.params.email;

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admins can approve reviews." });
  }

  try {
    const result = await Review.updateOne(
      { email },
      { isApproved: true }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Review not found or already approved." });
    }

    return res.status(200).json({ message: "Review approved successfully" });

  } catch (err) {
    res.status(500).json({ error: "Review approval failed" });
  }
}
