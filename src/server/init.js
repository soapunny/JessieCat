import "../storage/db";
import "../dbModels/videoDBModel";
import "../dbModels/userDBModel";
import app from "./server.js";

const PORT = 12080;
const HOSTNAME = "127.0.0.1";

app.listen(PORT, HOSTNAME, () => {
    console.log(`Server listening on port http://${HOSTNAME}:${PORT}`);
});