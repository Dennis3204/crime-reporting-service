import express from "express";
import homeRoutes from "./home.js";

const constructorMethod = (app) => {
  app.use("/", homeRoutes);
  app.use("/public", express.static("public"));
  app.use("{*splat}", (req, res) => {
    return res.status(404).json({error: "Not found"});
  });
};

export default constructorMethod;
