import express, { request, response } from "express";
//npm i express-session : session middleware.
import session from "express-session";
import morgan from "morgan";
import { localsMiddleware } from "../middlewares/middlewares";
import rootRouter from "../routers/rootRouter";
import userRouter from "../routers/userRouter";
import videoRouter from "../routers/videoRouter";

const app = express();
//=========================Middlewares==================================
const logger = morgan("dev");
//use: to add global middlewares
app.use(logger);//watch out the sequence.
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); //Change process's current directory.
app.use(express.urlencoded({extended: true})); //Make the express understand the Form-Data
app.use(session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
}));//use session middleware before routers.

app.use(localsMiddleware);
//=========================End Middlewares===============================


//=========================Router========================================

app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);
//=========================End Router=====================================

export default app;

