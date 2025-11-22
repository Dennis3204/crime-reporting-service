import express from "express";
import exphbs from "express-handlebars";
import configRoutesFunction from "./routes/index.js";
import {closeConnection, dbConnection} from "./config/mongoConnection.js";

await dbConnection();

const app = express();

app.engine("handlebars", exphbs.engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.set("views", "src/views");

configRoutesFunction(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});

await closeConnection();
