import {Router} from "express";
import {getReportList, getReport, ReportNotFoundError} from "../data/reports.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    const reports = await getReportList();
    return res.render("reports", {reports: reports});
  } catch (e) {
    return res.status(500).json("Internal server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const report = await getReport(req.params.id);
    return res.render("report", report);
  } catch (e) {
    if (e instanceof ReportNotFoundError)
      return res.status(404).json("Report not found");
    else
      return res.status(500).json("Internal server error");
  }
});

export default router;
