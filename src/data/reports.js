import * as comments from "./comments.js";
import * as users from "./users.js";
import * as collections from "../config/mongoCollections.js";
import * as errors from "../helpers/errors.js";
import * as validation from "../helpers/validation.js";

export const getReportList = async () => {
  const reports = await collections.reports();
  return reports.find({}, {_id: 1, title: 1}).toArray();
}

export const getReport = async (id, commentSort = "best") => {

  id = validation.validateObjectId(id, "report ID");
  commentSort = validation.validateString(commentSort, "sort order");

  const reports = await collections.reports();
  const report = await reports.findOne({_id: id});
  if (report === null)
    throw new errors.NotFoundError("Report not found.");

  report.author = await users.getUsername(report.author_id);

  report.comments = await comments.getCommentsForReport(id);
  for (const comment of report.comments) {
    comment.author = await users.getUsername(comment.author_id);
    comment.time = new Date(comment.timestamp).toLocaleString();
    comment.score = comment.liked_by.length - comment.disliked_by.length;
  }

  let sortFunc;
  if (commentSort === "best")
    sortFunc = (a, b) => (b.score - a.score);
  else if (commentSort === "worst")
    sortFunc = (a, b) => (a.score - b.score);
  else if (commentSort === "newest")
    sortFunc = (a, b) => (b.timestamp - a.timestamp);
  else if (commentSort === "oldest")
    sortFunc = (a, b) => (a.timestamp - b.timestamp);
  else
    throw new errors.BadRequestError("Invalid comment sort order.");
  report.comments.sort(sortFunc);

  return report;
};

export const searchByKeyword = async (keyword) =>{
    keyword = validation.validateTrimmableString(keyword,"keyword");
    const report = await collections.reports();
    const result = await report.find({title: report}).toArray()
    if(result.length === 0)
      throw "404"
    if(!result.acknowledged)
      throw new errors.InternalServerError("Failed to search");
    return result
}

export const searchByZipCode = async(zip) =>{
  zip = validation.validateTrimmableString(zip,"Zipcode")
  const report = await collections.reports()
  const result =  await report.find({zipcode: zip}).toArray()
  if(result.length === 0)
    throw "404"
  if(!result.acknowledged)
    throw new errors.InternalServerError("Failed to search");
  return result
}