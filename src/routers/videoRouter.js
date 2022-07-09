import express from "express";
import { getWatch, getEdit, postEdit, getDelete, getUpload, postUpload } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.route("/upload").get(getUpload).post(postUpload);//It has to be on the top. Not to be recognized as id
videoRouter.get("/:id", getWatch);
videoRouter.route("/:id/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id/delete", getDelete);
// /:id(\\d+) -> only allow numbers.
// /:id(\\w+) -> only allow words.

export default videoRouter;