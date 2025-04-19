import User from "../models/user.js";

export function registerUser(req, res){
      const newUser = new User(req.body)

      newUser.save().then(()=>{
            res.status(200).json({
                  message:"User registered successfully"
            })
      }).catch((err)=>{
            res.status(500).json({          
                  message:"User registration failed"  
            })
      })
}

// export function getUsers(req, res){
//       User
// }