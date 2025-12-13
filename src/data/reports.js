import * as comments from "./comments.js";
import * as users from "./users.js";
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
  const validZip = validation.validateZip(zipcode, 'zipcode'); 
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