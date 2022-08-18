import express, { request, response } from "express";
//npm i express-session : session middleware.
import session from "express-session";
//npm i connect-mongo
import MongoStore from "connect-mongo";
import morgan from "morgan";
//npm i express-flash
import flash from "express-flash";
import { localsMiddleware } from "../middlewares/middlewares";
import rootRouter from "../routers/rootRouter";
import userRouter from "../routers/userRouter";
import videoRouter from "../routers/videoRouter";
import { MongoServerSelectionError } from "mongodb";
import apiRouter from "../routers/apiRouter";

const app = express();
//=========================Middlewares==================================
const logger = morgan("dev");
//use: to add global middlewares
app.use(logger);//watch out the sequence.
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); //Change process's current directory.
app.use(express.urlencoded({extended: true})); //Make the express understand the Form-Data
app.use(express.json()); //To understand text messages.
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,//Only remember someone who login
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 30,
    },
    store: MongoStore.create({mongoUrl: process.env.MONGO_DB_URL}),//Save session in MongoDB
}));//use session middleware before routers.
app.use((req, res, next) => {
    req.
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "cross-origin");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
});

app.use(flash());
app.use(localsMiddleware);
//=========================End Middlewares===============================


//=========================Router========================================
app.use("/upload", express.static("upload"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);
app.use("/api", apiRouter);
//=========================End Router=====================================

export default app;

