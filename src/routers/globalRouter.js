import express from "express";
import {join, login } from "../controllers/userController.js";
import {showTrending, searchVideo } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", showTrending);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", searchVideo);

export default globalRouter;