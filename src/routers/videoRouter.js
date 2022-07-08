import express from "express";
import { watchVideo, editVideo, deleteVideo, uploadVideo } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", uploadVideo);//It has to be on the top. Not to be recognized as id
videoRouter.get("/:id", watchVideo);
videoRouter.get("/:id/edit", editVideo);
videoRouter.get("/:id/delete", deleteVideo);
// /:id(\\d+) -> only allow numbers.
// /:id(\\w+) -> only allow words.

export default videoRouter;