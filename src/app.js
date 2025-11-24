import express from "express";
import exphbs from "express-handlebars";
import configRoutesFunction from "./routes/index.js";
import {closeConnection, dbConnection} from "./config/mongoConnection.js";

console.log("Establishing database connection...");
await dbConnection();
console.log("Database connection established.");

const app = express();

app.engine("handlebars", exphbs.engine({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.set("views", "src/views");

configRoutesFunction(app);

const server = app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});

process.on("SIGTERM", () => {
  console.log("Shutting down server...");
  server.close(async () => {
    console.log("Server shut down.");
    console.log("Closing database connection...");
    await closeConnection();
    console.log("Database connection closed.");
  });
})
