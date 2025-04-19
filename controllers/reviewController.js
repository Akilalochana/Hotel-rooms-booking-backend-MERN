import Review from "../models/review.js";

export function addReview(req, res){
      if(req.user == null){
            res.status(401).json({
                  message:"please login and try again."
            })
            return
      }
      
      const data = req.body;
      data.name = req.user.firstName + " " + req.user.lastName;

      data.profilePicture = req.user.profilePicture;

      data.email = req.user.email;

      const newReview = new Review(data);
       newReview.save().then(()=>{
            res.status(200).json({
                  message:"Review added successfully"
            })
       }).catch((err)=>{
            res.status(500).json({
                  error:"Review addition failed"
            })
       })
}

export function getReviews(req, res){

      const user = req.user;

      if(user == null || user.role != "admin"){
            Review.find({isApproved:true}).then((reviews)=>{
                  res.json(reviews)
            })
            return
      }

      if(user.role =="admin"){
            Review.find().then((reviews)=>{
                  res.json(reviews)
            })
      }
}

export function deleteReview(req, res){
      const email = req.params.email;

      if(req.user ==null){
            res.status(401).json({
                  message:"please login and try again."
            })
            return
      }

      if(req.user.role == "admin"){
            Review.deleteOne({email:email}).then(()=>{
                  res.status(200).json({
                        message:"Review deleted successfully"
                  })
            }).catch(()=>{
                  res.status(500).json({
                        error:"Review deletion failed"
                  })
            })
            return
      }

      if(req.user.role == "customer"){
            if(user.email == email){
                  Review.deleteOne({email:email}).then(()=>{
                        res.status(200).json({
                              message:"Review deleted successfully"
                        })
                  }).catch(()=>{
                        res.status(500).json({
                              error:"Review deletion failed"
                        })
                  })
            }else{
                  res.status(401).json({
                        message:"You are not authorized to delete this review"
                  })
            }
            return
      }
}

export function approveReview(req, res){
      const email = req.params.email;

      if(req.user ==null){
            res.status(401).json({
                  message:"please login and try again."
            })
            return
      }

      if(req.user.role == "admin"){
            Review.updateOne({
                 email:email 
            },
            {
                  isApproved:true
            }).then(()=>{
                  res.status(200).json({
                        message:"Review approved successfully"
                  })
            }).catch(()=>{
                  res.status(500).json({
                        error:"Review approval failed"
                  })
            })
            
      }else{
            res.status(401).json({
                  message:"You are not admin! only the admins can approved reviews."
            })
      }
}