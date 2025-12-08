import {Router} from "express";
import * as reports from "../data/reports.js";
import * as helpers from "../helpers/errors.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    const reportList = await reports.getReportList();
    return res.render("reports", {reports: reportList});
  } catch (e) {
    return helpers.renderErrorPage(res, e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const report = await reports.getReport(req.params.id);
    return res.render("report", {report, user: req.session.user});
  } catch (e) {
    return helpers.renderErrorPage(res, e);
  }
});

router.post("/:id/comment", async (req, res) => {
  try {
    if (req.session.user === undefined)
      throw new helpers.UnauthorizedError();
    await reports.addComment(req.params.id, req.session.user._id, req.body.comment);
    return res.redirect(`/reports/${req.params.id}`);
  } catch (e) {
    return helpers.renderErrorPage(res, e);
  }
});

export default router;
