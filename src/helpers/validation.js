import {BadRequestError} from "./errors.js";
import {ObjectId} from "mongodb";

const InvalidInputError = class extends BadRequestError {
  constructor(message) {
    super(`Invalid input: ${message.charAt(0).toUpperCase()}${message.slice(1)}`);
  }
};

export const validateString = (str, name) => {
  if (typeof str !== "string" || str.length === 0)
    throw new InvalidInputError(`Expected ${name} to be a non-empty string.`);
  return str;
};

export const validateObjectId = (id, name = "object ID") => {
  id = validateString(id, name);
  if (!ObjectId.isValid(id))
    throw new InvalidInputError(`${name} is invalid.`);
  return new ObjectId(id);
};
