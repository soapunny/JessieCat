import express from "express";
import {getJoin, postJoin, getLogin, postLogin, getLogout } from "../controllers/userController.js";
import {getHome, getSearch } from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/", getHome);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/logout", getLogout);
rootRouter.get("/search", getSearch);

export default rootRouter;