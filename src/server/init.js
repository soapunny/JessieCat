//npm i dotenv
import "dotenv/config";//Must be started at first.
import "../db/storage/db";
import "../db/videoDBModel";
import "../db/userDBModel";
import app from "./server.js";

const PORT = 12080;
const HOSTNAME = "127.0.0.1";

app.listen(PORT, HOSTNAME, () => {
    console.log(`Server listening on port http://${HOSTNAME}:${PORT}`);
});