import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_DB_URL);

const db = mongoose.connection;
db.on("error", (error) => console.log("DB Error: ", error));//on : everytime
db.once("open", () => console.log("Connected to DB!"));//once: one time