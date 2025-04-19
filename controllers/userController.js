import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

export function logingUser(req, res){
      const data = req.body;

      User.findOne({
            email: data.email
      }).then(
            (user)=>{
                  if(user==null){
                        res.status(404).json({
                              message:"User not found"
                        })
                  }else{
                        
                        const isPasswordCorrect = bcrypt.compareSync(data.password,user.password);

                        if(isPasswordCorrect){
                              const token = jwt.sign({
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    email: user.email,
                                    role: user.role
                              }, "ak-secret-19!")
                              res.json({
                                    message:"User logged in successfully",
                                    token:token
                              })
                        }else{
                              res.status(401).json({
                                    error:"Invalid password"
                              })
                        }
                           
                  }
            }
      )
}