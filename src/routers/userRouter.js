import express from "express";
import { getUser, getProfile, getEdit, getDelete } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.get("/profile", getProfile);
userRouter.get("/edit", getEdit);
userRouter.get("/delete", getDelete);

export default userRouter;