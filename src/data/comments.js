import * as collections from "../config/mongoCollections.js";
import * as errors from "../helpers/errors.js";
import * as validation from "../helpers/validation.js";

export const getCommentsForReport = async (reportId) => {
  const comments = await collections.comments();
  return comments.find({report_id: reportId}).toArray();
};

export const addComment = async (reportId, userId, comment) => {
  reportId = validation.validateObjectId(reportId, "report ID");
  userId = validation.validateObjectId(userId, "user ID");
  comment = validation.validateTrimmableString(comment, "comment");
  const comments = await collections.comments();
  const result = await comments.insertOne({report_id: reportId, user_id: userId, comment});
  if (!result.acknowledged)
    throw new errors.InternalServerError("Failed to add comment.");
  return result;
};
