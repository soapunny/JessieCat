import express from "express";
import { showUserHome, logout, editUser, deleteUser } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", showUserHome);
userRouter.get("/logout", logout);
userRouter.get("/edit", editUser);
userRouter.get("/delete", deleteUser);

export default userRouter;