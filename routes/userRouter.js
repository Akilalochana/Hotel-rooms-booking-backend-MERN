import express from "express";
import { blockOrUnblockUser, getAllUsers, getUser, logingUser, loginWithGoogle, registerUser } from "../controllers/userController.js";


const userRouter =  express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login", logingUser)
userRouter.get("/all", getAllUsers)
userRouter.put("/block/:email", blockOrUnblockUser )
userRouter.post("/google", loginWithGoogle)

userRouter.get("/",getUser)

export default userRouter;