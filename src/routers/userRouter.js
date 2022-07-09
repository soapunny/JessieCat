import express from "express";
import { getUser, getLogout, getEdit, getDelete } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.get("/logout", getLogout);
userRouter.get("/edit", getEdit);
userRouter.get("/delete", getDelete);

export default userRouter;