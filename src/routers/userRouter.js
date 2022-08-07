import express from "express";
import { getLogout, getGithubLogin, getChangePassword, postChangePassword, getGithubCallback, getProfile, getEdit, postEdit, getDelete, postDelete } from "../controllers/userController";
import { loginOnlyMiddleware, logoutOnlyMiddleware, acceptImageFiles } from "../middlewares/middlewares";

const userRouter = express.Router();

userRouter.get("/logout", loginOnlyMiddleware, getLogout);
userRouter.get("/profile/:username", loginOnlyMiddleware, getProfile);
userRouter.route("/edit")
            .all(loginOnlyMiddleware)
            .get(getEdit)
            .post(acceptImageFiles.single('avatar'), postEdit);
userRouter.route("/delete")
            .all(loginOnlyMiddleware)
            .get(getDelete)
            .post(postDelete);
userRouter.route("/changePassword")
            .all(loginOnlyMiddleware)
            .get(getChangePassword)
            .post(postChangePassword);
userRouter.get("/github/login",logoutOnlyMiddleware, getGithubLogin);
userRouter.get("/github/callback",logoutOnlyMiddleware, getGithubCallback);

export default userRouter;