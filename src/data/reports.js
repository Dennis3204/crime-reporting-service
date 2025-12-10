import * as collections from "../config/mongoCollections.js";
import * as errors from "../helpers/errors.js";
import * as validation from "../helpers/validation.js";
import { ObjectId } from "mongodb";




export const createReport = async (
  authorId,
  {
    title,
    desc,
    crime,
    state,
    city,
    area,
    zipcode,
    imgPaths,
    isAnonymous
  }
) => {
  // validate IDs & strings using your helper functions
  const validAuthorId = validation.validateObjectId(authorId, 'authorId');
  const validTitle = validation.validateString(title, 'title');
  const validDesc = validation.validateString(desc, 'description');
  const validCrime = validation.validateString(crime, 'crime');
  const validState = validation.validateString(state, 'state');
  const validCity = validation.validateString(city, 'city');
  const validArea = validation.validateString(area, 'area');
  const validZip = validation.validateZip(zipcode, 'zipcode'); // <-- NOT IMPLEMENTED YET
  const validAnon = Boolean(isAnonymous);

  const imgArray = Array.isArray(imgPaths) ? imgPaths : [];

  const reportDoc = {
    author_id: validAuthorId,
    title: validTitle,
    desc: validDesc,
    img: imgArray,
    crime: validCrime,
    state: validState,
    city: validCity,
    area: validArea,
    zipcode: validZip,
    upvotes: 0,
    downvotes: 0,
    comments: [],
    isAnonymous: validAnon,
    createdAt: new Date()
  };

  const reports = await collections.reports();
  const insertInfo = await reports.insertOne(reportDoc);


  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error('Could not create report');
  }

  reportDoc._id = insertInfo.insertedId;
  return reportDoc;
};


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
