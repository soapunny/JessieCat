import express, { request, response } from "express";
import morgan from "morgan";
import globalRouter from "../routers/globalRouter";
import userRouter from "../routers/userRouter";
import videoRouter from "../routers/videoRouter";

const app = express();
//=========================Middlewares==================================
const logger = morgan("dev");
//use: to add global middlewares
app.use(logger);//watch out the sequence.
//=========================End Middlewares===============================


//=========================Router========================================
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); //Change process's current directory.
app.use(express.urlencoded({extended: true})) //Make the express understand the Form-Data
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);
//=========================End Router=====================================

export default app;

