import {Router} from "express";
import * as comments from "../data/comments.js";
import * as helpers from "../helpers/errors.js";

const router = new Router();

router.post("/:id/like", async (req, res) => {
  try {
    await comments.toggleLike(req.params.id, req.session.user._id);
    const comment = await comments.getComment(req.params.id);
    return res.redirect(`/reports/${comment.report_id}`);
  } catch (e) {
    return helpers.renderErrorPage(res, e);
  }
});

router.post("/:id/dislike", async (req, res) => {
  try {
    await comments.toggleDislike(req.params.id, req.session.user._id);
    const comment = await comments.getComment(req.params.id);
    return res.redirect(`/reports/${comment.report_id}`);
  } catch (e) {
    return helpers.renderErrorPage(res, e);
  }
});

export default router;
