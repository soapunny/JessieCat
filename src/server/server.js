import express, { request, response } from "express";
import morgan from "morgan";
import globalRouter from "../routers/globalRouter";
import userRouter from "../routers/userRouter";
import videoRouter from "../routers/videoRouter";

const PORT = 12080;
const app = express();

//=========================Middlewares==================================
const logger = morgan("dev");
//use: to add global middlewares
app.use(logger);//watch out the sequence.
//=========================End Middlewares===============================


//=========================Router========================================

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); //Change process's current directory.
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);

//=========================End Router=====================================


app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});

