import * as comments from "./comments.js";
import * as users from "./users.js";
import * as collections from "../config/mongoCollections.js";
import * as errors from "../helpers/errors.js";
import * as validation from "../helpers/validation.js";

export const getReportList = async () => {
  const reports = await collections.reports();
  return reports.find({}, {_id: 1, title: 1}).toArray();
}

export const getReport = async (id) => {

  id = validation.validateObjectId(id, "report ID");
  const reports = await collections.reports();
  const report = await reports.findOne({_id: id});
  if (report === null)
    throw new errors.NotFoundError("Report not found.");

  report.author = await users.getUsername(report.author_id);

  report.comments = await comments.getCommentsForReport(id);
  for (const comment of report.comments) {
    comment.user = await users.getUsername(comment.user_id);
  }

  return report;
};
