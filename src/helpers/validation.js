import {BadRequestError} from "./errors.js";
import {ObjectId} from "mongodb";

const InvalidInputError = class extends BadRequestError {
  constructor(message) {
    super(`Invalid input: ${message.charAt(0).toUpperCase()}${message.slice(1)}`);
  }
};

export const validateZip = (zip, name = "ZIP code") => {
  zip = validateTrimmableString(zip, name);

  if (!/^\d{5}$/.test(zip)) {
    throw new InvalidInputError(`${name} must be a 5-digit number.`);
  }
  return zip;
};

export const validateString = (str, name) => {
  if (typeof str !== "string" || str.length === 0)
    throw new InvalidInputError(`Expected ${name} to be a non-empty string.`);
  return str;
};

export const validateTrimmableString = (str, name) => {
  str = validateString(str, name).trim();
  if (str.length === 0)
    throw new InvalidInputError(`${name} must contain non-whitespace characters.`);
  return str;
};

export const validateWord = (word, name) => {
  word = validateTrimmableString(word, name);
  if (word.match(/\s/))
    throw new InvalidInputError(`${name} must not contain any whitespace.`);
  return word;
}

export const validateUsername = (username) => {
  username = validateWord(username, "username");
  if (username.length < 3)
    throw new InvalidInputError("Username must be at least 3 characters long.");
  return username;
};

export const validatePassword = (password) => {
  password = validateString(password, "password");
  if (password.length < 8)
    throw new InvalidInputError("Password must be at least 8 characters long.");
  return password;
};

export const validateObjectId = (id, name = "object ID") => {
  id = validateString(id, name);
  if (!ObjectId.isValid(id))
    throw new InvalidInputError(`${name} is invalid.`);
  return new ObjectId(id);
};

export const validateNumber = (num, name) => {
  num = Number(num);
  if (isNaN(num))
    throw new InvalidInputError(`Expected ${name} to be a number.`);
  return num;
};
