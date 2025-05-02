import express from "express";
import { blockOrUnblockUser, getAllUsers, logingUser, registerUser } from "../controllers/userController.js";


const userRouter =  express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login", logingUser)
userRouter.get("/all", getAllUsers)
userRouter.put("/block/:email", blockOrUnblockUser )



export default userRouter;