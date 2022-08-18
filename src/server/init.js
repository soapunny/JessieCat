//npm i dotenv
import "dotenv/config";//Must be started at first.
import "../db/storage/db";
import "../db/videoDBModel";
import "../db/userDBModel";
import "../db/commentDBModel";
import "../db/likeDBModel";
import "../db/statusDBModel";
import app from "./server.js";

const PORT = process.env.PORT || 12080;

app.listen(PORT, () => {
    console.log(`Server listening on port http://${HOSTNAME}:${PORT}`);
});