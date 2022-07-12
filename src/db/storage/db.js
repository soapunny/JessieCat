import mongoose from "mongoose";
import { getMongoDBPassword, getMongoDBURL } from "../../privacy/dbInfo";

mongoose.connect(getMongoDBURL());

const db = mongoose.connection;
db.on("error", (error) => console.log("DB Error: ", error));//on : everytime
db.once("open", () => console.log("Connected to DB!"));//once: one time