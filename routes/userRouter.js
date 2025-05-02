import express from "express";
import { blockOrUnblockUser, getAllUsers, getUser, logingUser, registerUser } from "../controllers/userController.js";


const userRouter =  express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login", logingUser)
userRouter.get("/all", getAllUsers)
userRouter.put("/block/:email", blockOrUnblockUser )

userRouter.get("/",getUser)

export default userRouter;