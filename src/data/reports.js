import {ObjectId} from "mongodb";
import * as collections from "../config/mongoCollections.js";
import * as errors from "../helpers/errors.js";

export const getReportList = async () => {
  const reports = await collections.reports();
  return reports.find({}, {_id: 1, title: 1}).toArray();
}

export const getReport = async (id) => {
  // TODO: Validate object ID
  const reports = await collections.reports();
  const report = await reports.findOne({_id: new ObjectId(id)});
  if (report === null)
    throw new errors.NotFoundError("Report not found.");
  return report;
};
