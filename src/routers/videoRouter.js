import express from "express";
import { getWatch, getRandom, getEdit, postEdit, getDelete, getUpload, postUpload } from "../controllers/videoController";
import { acceptFiles, acceptVideoFiles, loginOnlyMiddleware, logoutOnlyMiddleware } from "../middlewares/middlewares";
import { THUMBNAIL_FIELD_NAME, VIDEO_FIELD_NAME } from "../names/names";

const videoRouter = express.Router();

videoRouter.route("/upload")
            .all(loginOnlyMiddleware)
            .get(getUpload)
            .post(acceptVideoFiles.fields([
                                {name: VIDEO_FIELD_NAME, maxCount: 1}
                                , {name: THUMBNAIL_FIELD_NAME, maxCount: 1}
                            ]), postUpload);//It has to be on the top. Not to be recognized as id
videoRouter.get("/random", getRandom);
videoRouter.get("/:id([0-9a-f]{24})", getWatch);
videoRouter.route("/:id([0-9a-f]{24})/edit")
            .all(loginOnlyMiddleware)
            .get(getEdit)
            .post(acceptVideoFiles.single('video'), postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete",loginOnlyMiddleware, getDelete);
// /:id(\\d+) -> only allow numbers.
// /:id(\\w+) -> only allow words.

export default videoRouter;