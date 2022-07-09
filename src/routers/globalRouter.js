import express from "express";
import {getJoin, getLogin } from "../controllers/userController.js";
import {getHome } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", getHome);
globalRouter.get("/join", getJoin);
globalRouter.get("/login", getLogin);

export default globalRouter;