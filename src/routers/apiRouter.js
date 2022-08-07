import express from "express";
import { GetDeleteComment, postComment, increaseView } from "../controllers/videoController";
import { loginOnlyMiddleware } from "../middlewares/middlewares";

const apiRouter = express.Router();

apiRouter.post("/video/:id([0-9a-f]{24})/view", increaseView);
apiRouter.route("/video/:id([0-9a-f]{24})/comment").all(loginOnlyMiddleware).post(postComment);
apiRouter.route("/video/:id([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/delete").all(loginOnlyMiddleware).get(GetDeleteComment);
export default apiRouter;