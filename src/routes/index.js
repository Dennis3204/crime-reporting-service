import express from "express";
import homeRoutes from "./home.js";
import reportsRoutes from "./reports.js";

const constructorMethod = (app) => {
  app.use("/", homeRoutes);
  app.use("/reports", reportsRoutes);
  app.use("/public", express.static("public"));
  app.use("{*splat}", (req, res) => {
    return res.status(404).json({error: "Not found"});
  });
};

export default constructorMethod;
