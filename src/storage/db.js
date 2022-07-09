import mongoose from "mongoose";
import { getMongoDBPassword } from "../privacy/password";

const DB_URL = `mongodb+srv://soapunny:${getMongoDBPassword()}@cluster0.mpn0d.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(DB_URL);

const db = mongoose.connection;
db.on("error", (error) => console.log("DB Error: ", error));//on : everytime
db.once("open", () => console.log("Connected to DB!"));//once: one time
