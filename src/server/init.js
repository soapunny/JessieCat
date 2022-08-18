//npm i dotenv
import "dotenv/config";//Must be started at first.
import "../db/storage/db";
import "../db/videoDBModel";
import "../db/userDBModel";
import "../db/commentDBModel";
import "../db/likeDBModel";
import "../db/statusDBModel";
import app from "./server.js";

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 12080;

app.listen(PORT, HOST, () => {
    console.log(`Server listening on port http://${HOST}:${PORT}`);
});