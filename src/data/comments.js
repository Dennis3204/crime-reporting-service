import * as collections from "../config/mongoCollections.js";
import * as errors from "../helpers/errors.js";
import * as validation from "../helpers/validation.js";

const LIKE = 'like';
const DISLIKE = 'dislike';

export const getComment = async (id) => {
  id = validation.validateObjectId(id, "comment ID");
  const comments = await collections.comments();
  const comment = await comments.findOne({_id: id});
  if (comment === null)
    throw new errors.NotFoundError("Comment not found.");
  return comment;
}

export const getCommentsForReport = async (reportId) => {
  reportId = validation.validateObjectId(reportId, "report ID");
  const comments = await collections.comments();
  return comments.find({report_id: reportId}).toArray();
};

export const addComment = async (reportId, authorId, comment) => {
  reportId = validation.validateObjectId(reportId, "report ID");
  authorId = validation.validateObjectId(authorId, "author ID");
  comment = validation.validateTrimmableString(comment, "comment");
  const comments = await collections.comments();
  const result = await comments.insertOne({
    report_id: reportId,
    author_id: authorId,
    comment,
    timestamp: Date.now(),
    liked_by: [],
    disliked_by: []
  });
  if (!result.acknowledged)
    throw new errors.InternalServerError("Failed to add comment.");
  return result;
};

export const toggleLike = async (commentId, userId) => {
  return toggleFeedback(commentId, userId, LIKE);
}

export const toggleDislike = async (commentId, userId) => {
  return toggleFeedback(commentId, userId, DISLIKE);
};

const toggleFeedback = async (commentId, userId, feedback) => {

  commentId = validation.validateObjectId(commentId, "comment ID");
  userId = validation.validateObjectId(userId, "user ID");

  const comments = await collections.comments();
  const predicate = {_id: commentId};
  const comment = await comments.findOne(predicate);
  if (comment === null)
    throw new errors.NotFoundError("Comment not found.");

  let update = {$pull: {liked_by: userId, disliked_by: userId}};
  if (feedback === LIKE && comment.liked_by.find(id => userId.equals(id)) === undefined) {
    update = {$addToSet: {liked_by: userId}, $pull: {disliked_by: userId}};
  } else if (feedback === DISLIKE && comment.disliked_by.find(id => userId.equals(id)) === undefined) {
    update = {$addToSet: {disliked_by: userId}, $pull: {liked_by: userId}};
  }
  const result = await comments.updateOne(predicate, update);

  if (!result.acknowledged)
    throw new errors.InternalServerError(`Failed to react to comment.`);
  else if (result.matchedCount === 0)
    throw new errors.NotFoundError("Comment not found.");
  return result;
}
