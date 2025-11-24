import {InvalidInputError} from "./errors.js";
import {ObjectId} from "mongodb";

export const validateString = (str) => {
  if (typeof str !== "string" || str.trim().length === 0)
    throw new InvalidInputError()
  return str.trim();
};

export const validateObjectId = (id) => {
  id = validateString(id);
  if (!ObjectId.isValid(id))
    throw new InvalidInputError();
  return id;
};
