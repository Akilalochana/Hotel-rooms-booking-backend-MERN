import express from "express";
import { logingUser, registerUser } from "../controllers/userController.js";


const userRouter =  express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login", logingUser)



export default userRouter;