import User from "../models/user.js";
import bcrypt from "bcrypt";

export function registerUser(req, res){
      const data = req.body;

      data.password = bcrypt.hashSync(data.password,10)

      const newUser = new User(data);

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