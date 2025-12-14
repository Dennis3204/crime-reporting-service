import * as comments from "./comments.js";
import * as users from "./users.js";
import * as collections from "../config/mongoCollections.js";
import * as errors from "../helpers/errors.js";
import * as validation from "../helpers/validation.js";

export const createReport = async (authorId, title, desc, crime, state, city,
                                   area, zipcode, imgPaths, isAnonymous) => {

  const img = Array.isArray(imgPaths) ? imgPaths : [];
  let report = {author_id: authorId, title, desc, crime, state, city, area, zipcode, img, is_anonymous: isAnonymous};
  validation.validateReport(report);
  report.created_at = new Date();
  report.edited_at = new Date();

  const reports = await collections.reports();
  const result = await reports.insertOne(report);
  if (!result.acknowledged || !result.insertedId) {
    throw new Error("Could not create report");
  }

  report._id = result.insertedId;
  return report;
};

export const updateReport = async (id, title, desc, crime, state, city, area, zipcode, isAnonymous) => {

  id = validation.validateObjectId(id, "report ID");
  let reportData = {title, desc, crime, state, city, area, zipcode, is_anonymous: isAnonymous};
  reportData = validation.validateReportData(reportData);
  reportData.edited_at = new Date();

  const reports = await collections.reports();
  const result = await reports.updateOne({_id: id}, {$set: reportData});
  if (!result.acknowledged)
    throw new Error("Could not update report");
  else if (result.matchedCount === 0)
    throw new errors.NotFoundError("Report not found");
};

export const deleteReport = async (id) => {
  id = validation.validateObjectId(id, "report ID");
  const reports = await collections.reports();
  const result = await reports.deleteOne({_id: id});
  if (!result.acknowledged)
    throw new Error("Could not delete report");
  else if (result.deletedCount === 0)
    throw new errors.NotFoundError("Report not found");
};

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

    if (report.isAnonymous) {
      report.author = "Anonymous";
    } else {
      report.author = await users.getUsername(report.author_id);
    }

  report.comments = await comments.getCommentsForReport(id);
  for (const comment of report.comments) {
    comment.author = await users.getUsername(comment.author_id);
    if (!comment.created_at) console.log("BAD COMMENT:", comment);
    comment.time = comment.created_at.toLocaleString();
    comment.score = comment.liked_by.length - comment.disliked_by.length;
  }

  let sortFunc;
  if (commentSort === "best")
    sortFunc = (a, b) => (b.score - a.score);
  else if (commentSort === "worst")
    sortFunc = (a, b) => (a.score - b.score);
  else if (commentSort === "newest")
    sortFunc = (a, b) => (b.created_at - a.created_at);
  else if (commentSort === "oldest")
    sortFunc = (a, b) => (a.created_at - b.created_at);
  else
    throw new errors.BadRequestError("Invalid comment sort order.");
  report.comments.sort(sortFunc);

  return report;
};

export const searchByKeyword = async (keyword) =>{
    keyword = validation.validateTrimmableString(keyword,"keyword");
    let key_regex = new RegExp('.*' + keyword + '.*', 'i')
    const report = await collections.reports();
    const result = await report.find({title: {$regex: key_regex}}).toArray()
    if(result.length === 0)
      throw "404"
    return result
}
export const searchByCrime = async (keyword) =>{
    keyword = validation.validateTrimmableString(keyword,"keyword");
    let key_regex = new RegExp('.*' + keyword + '.*', 'i')
    const report = await collections.reports();
    const result = await report.find({crime: {$regex: key_regex}}).toArray()
    if(result.length === 0)
      throw "404"
    return result
}

export const searchByZipCode = async(zip) =>{
  zip = validation.validateTrimmableString(zip,"Zipcode")
  const report = await collections.reports()
  const result =  await report.find({zipcode: zip}).toArray()
  if(result.length === 0)
    throw "404"
  return result
}
