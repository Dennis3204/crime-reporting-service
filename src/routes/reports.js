import {Router} from "express";
import * as comments from "../data/comments.js";
import * as reports from "../data/reports.js";
import * as helpers from "../helpers/errors.js";
import upload from "../config/multer.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    const reportList = await reports.getReportList();
    return res.render("reports", {
      title: "Reports",
      reports: reportList,
      user: req.session.user
    });
  } catch (e) {
    return helpers.renderErrorPage(res, e);
  }
});


router.get("/new", (req, res) => {
  try {
    if (!req.session.user) throw new helpers.UnauthorizedError();

    const loc = req.session.user.location || {};
    const prefill = {
      title: "",
      desc: "",
      crime: "",
      state: loc.state || "",
      city: loc.city || "",
      area: loc.area || "",
      zipcode: loc.zipcode || "",
      anonymous: false
    };

    return res.render("create-report", { title: "Create Report", prefill });
  } catch (e) {
    return helpers.renderErrorPage(res, e);
  }
});



router.get("/:id", async (req, res) => {
  try {
    const report = await reports.getReport(req.params.id, req.query.sort);
    return res.render("report", {
      title: report.title,
      report,
      sort: req.query.sort,
      user: req.session.user
    });
  } catch (e) {
    return helpers.renderErrorPage(res, e);
  }
});


router.post("/", upload.array("photos", 5), async (req, res) => {
  try {
    if (req.session.user === undefined)
      throw new helpers.UnauthorizedError();

    const authorId = req.session.user._id;
    const {title, desc, crime, state, city, area, zipcode, anonymous} = req.body;

    // Map uploaded files to public URLs
    const imgPaths =
      Array.isArray(req.files) && req.files.length > 0
        ? req.files.map((f) => `/public/uploads/reports/${f.filename}`)
        : [];

    const report = await reports.createReport(authorId, title, desc,
      crime, state, city, area, zipcode, imgPaths, anonymous === "on");

    return res.redirect(`/reports/${report._id.toString()}`);
  } catch (e) {
    // If it's a validation error (BadRequestError), re-render the form with error message
    if (e instanceof helpers.BadRequestError) {
      const {title, desc, crime, state, city, area, zipcode, anonymous} = req.body;
      const prefill = {
        title: title || "",
        desc: desc || "",
        crime: crime || "",
        state: state || "",
        city: city || "",
        area: area || "",
        zipcode: zipcode || "",
        anonymous: anonymous === "on"
      };
      return res.render("create-report", {
        title: "Create Report",
        error: e.message,
        prefill
      });
    }
    // For other errors, use the generic error page
    return helpers.renderErrorPage(res, e);
  }
});

router.post("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const report = await reports.getReport(id);
    if (!report.author_id.equals(req.session.user?._id))
      throw new helpers.UnauthorizedError();

    const {title, desc, crime, state, city, area, zipcode, anonymous} = req.body;
    await reports.updateReport(id, title, desc, crime, state, city, area, zipcode, anonymous === "on");

    return res.redirect(`/reports/${report._id.toString()}`);
  } catch (e) {
    return helpers.renderErrorPage(res, e);
  }
});

router.get("/:id/delete", async (req, res) => {
  try {
    const id = req.params.id;
    const report = await reports.getReport(id);
    if (!report.author_id.equals(req.session.user._id))
      throw new helpers.UnauthorizedError();

    await reports.deleteReport(id);

    return res.redirect("/reports");
  } catch (e) {
    return helpers.renderErrorPage(res, e);
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    if (req.session.user === undefined)
      throw new helpers.UnauthorizedError();

    const report = await reports.getReport(req.params.id);
    if (!report.author_id.equals(req.session.user._id))
      throw new helpers.UnauthorizedError();

    return res.render("edit-report", {
      title: "Edit Report",
      report,
      user: req.session.user
    });
  } catch (e) {
    return helpers.renderErrorPage(res, e);
  }
})

router.post("/:id/comment", async (req, res) => {
  try {
    if (req.session.user === undefined)
      throw new helpers.UnauthorizedError();
    await comments.addComment(req.params.id, req.session.user._id, req.body.comment);
    return res.redirect(`/reports/${req.params.id}`);
  } catch (e) {
    return helpers.renderErrorPage(res, e);
  }
});

export default router;
