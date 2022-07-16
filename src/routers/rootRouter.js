import express from "express";
import {getJoin, postJoin, getLogin, postLogin } from "../controllers/userController.js";
import {getHome, getSearch } from "../controllers/videoController";
import { loginOnlyMiddleware, logoutOnlyMiddleware } from "../middlewares/middlewares.js";

const rootRouter = express.Router();

rootRouter.get("/", getHome);
rootRouter.route("/join").all(logoutOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(logoutOnlyMiddleware).get(getLogin).post(postLogin);
rootRouter.get("/search", getSearch);

export default rootRouter;