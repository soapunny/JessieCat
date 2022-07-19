import express from "express";
import { getWatch, getEdit, postEdit, getDelete, getUpload, postUpload } from "../controllers/videoController";
import { acceptVideoFiles, loginOnlyMiddleware, logoutOnlyMiddleware } from "../middlewares/middlewares";

const videoRouter = express.Router();

videoRouter.route("/upload")
            .all(loginOnlyMiddleware)
            .get(getUpload)
            .post(acceptVideoFiles.single('video') ,postUpload);//It has to be on the top. Not to be recognized as id
videoRouter.get("/:id([0-9a-f]{24})", getWatch);
videoRouter.route("/:id([0-9a-f]{24})/edit")
            .all(loginOnlyMiddleware)
            .get(getEdit)
            .post(acceptVideoFiles.single('video'), postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete",loginOnlyMiddleware, getDelete);
// /:id(\\d+) -> only allow numbers.
// /:id(\\w+) -> only allow words.

export default videoRouter;