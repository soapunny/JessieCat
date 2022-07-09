import "../storage/db";
import "../dbModels/videoDBModel";
import app from "./server.js";

const PORT = 12080;

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});