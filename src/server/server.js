import express, { request, response } from "express";
//npm i express-session : session middleware.
import session from "express-session";
//npm i connect-mongo
import MongoStore from "connect-mongo";
import { getMongoDBURL } from "../privacy/dbInfo";
import morgan from "morgan";
import { localsMiddleware } from "../middlewares/middlewares";
import rootRouter from "../routers/rootRouter";
import userRouter from "../routers/userRouter";
import videoRouter from "../routers/videoRouter";
import { MongoServerSelectionError } from "mongodb";

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
    resave: false,//Only remember someone who login
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: getMongoDBURL()}),//Save session in MongoDB
}));//use session middleware before routers.

app.use(localsMiddleware);
//=========================End Middlewares===============================


//=========================Router========================================

app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);
//=========================End Router=====================================

export default app;

