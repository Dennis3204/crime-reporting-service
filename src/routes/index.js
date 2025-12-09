import express from "express";
import homeRoutes from "./home.js";
import reportsRoutes from "./reports.js";
import authRoutes from "./auth.js";
import searchRoutes from "./search.js";
import * as errors from "../helpers/errors.js";

const constructorMethod = (app) => {
  app.use("/", authRoutes);
  app.use("/", homeRoutes);
  app.use("/", searchRoutes);
  app.use("/reports", reportsRoutes);
  app.use("/public", express.static("public"));
  app.use("{*splat}", (req, res) => {
    return errors.renderErrorPage(res, new errors.NotFoundError());
  });
};

export default constructorMethod;
