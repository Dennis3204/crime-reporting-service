import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import configRoutesFunction from "./routes/index.js";
import {closeConnection, dbConnection} from "./config/mongoConnection.js";
import registerHelpers from "./helpers/handlebars.js";

console.log("Establishing database connection...");
await dbConnection();
console.log("Database connection established.");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ name: "sessionId", secret: "noonewilleverfigurethiskeyout@" ,saveUninitialized: false, resave: false, cookie: {maxAge: 3600000}}));
app.use(express.static("public"));

const hbs = exphbs.create({defaultLayout: "main"});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "src/views");

registerHelpers(hbs);

app.use("/search",(req,res,next) =>{
  if(!req.session.user){
    return res.redirect("/login")
  }
  next()
})
app.use("/map",(req,res,next) =>{
  if(!req.session.user){
    return res.redirect("/login")
  }
  next()
})
app.use("/reports",(req,res,next) =>{
  if(!req.session.user){
    return res.redirect("/login")
  }
  next()
})
app.use("/logout",(req,res,next) =>{
  if(!req.session.user){
    return res.redirect("/login")
  }
  next()
})

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
