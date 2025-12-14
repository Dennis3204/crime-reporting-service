import {Router} from "express";
import * as reportsData from "../data/reports.js";

const router = new Router();

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

router.get("/", requireLogin, async (req, res) => {
  const reports = await reportsData.getReportList();
  res.render("home", { title: "Home", user: req.session.user, reports: reports});
});

export default router;
