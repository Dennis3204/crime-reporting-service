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

  const users =  await collections.users();
  const author = await users.findOne({_id: report.author_id}, {username: 1});
  report.author = author.username;
  for (const comment of report.comments) {
    const user = await users.findOne({_id: comment.user_id}, {username: 1});
    comment.user = user.username;
  }

  return report;
};

export const addComment = async (id, userId, comment) => {
  id = validation.validateObjectId(id, "report ID");
  userId = validation.validateObjectId(userId, "user ID");
  comment = validation.validateTrimmableString(comment, "comment");
  const reports = await collections.reports();
  const result = await reports.updateOne({_id: id}, {$push: {comments: {user_id: userId, comment}}});
  if (!result.acknowledged)
    throw new errors.InternalServerError("Failed to add comment.");
  else if (result.matchedCount < 1)
    throw new errors.NotFoundError("Report not found.")
  else if (result.modifiedCount < 1)
    throw new errors.InternalServerError("Failed to add comment.")
  return result;
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