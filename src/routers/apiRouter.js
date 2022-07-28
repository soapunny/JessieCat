import express from "express";
import { increaseView } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/video/:id([0-9a-f]{24})/view", increaseView);

export default apiRouter;