import {BadRequestError} from "./errors.js";
import {ObjectId} from "mongodb";
import us from "us";


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

export const validateZipcode = (zipcode) => {
  zipcode = validateTrimmableString(zipcode, "zipcode");
  if (!/^\d{5}$/.test(zipcode)) {
    throw new Error("ZIP code must be 5 digits.");
  }
  return zipcode;
};

function validateUSState(state) {
  const s = validateTrimmableString((state || "")).toUpperCase();

  if (!Boolean(us.states[s])) { 
    throw new InvalidInputError(`${state} is not a valid state.`);
  }
  return state;
}

export const validateBoolean = (bool, name) => {
  if (typeof bool !== "boolean")
    throw new InvalidInputError(`Expected ${name} to be a boolean.`);
  return bool;
};

export const validateArray = (arr, name) => {
  if (!Array.isArray(arr))
    throw new InvalidInputError(`Expected ${name} to be an array.`);
  return arr;
}

export const validateObject = (obj, name) => {
  if (typeof obj !== "object" || obj === null)
    throw new InvalidInputError(`Expected ${name} to be an object.`);
  return obj;
}

export const validateReportData = (report) => {
  report = validateObject(report, "report");
  report.title = validateTrimmableString(report.title, "title");
  report.desc = validateTrimmableString(report.desc, "description");
  report.crime = validateTrimmableString(report.crime, "crime");
  report.state = validateTrimmableString(report.state, "state");
  report.state = validateUSState(report.state);
  report.city = validateTrimmableString(report.city, "city");
  report.area = validateTrimmableString(report.area, "area");
  report.zipcode = validateZipcode(report.zipcode);
  report.is_anonymous = validateBoolean(report.is_anonymous, "anonymity");
  return report;
}

export const validateReport = (report) => {
  report = validateReportData(report);
  report.author_id = validateObjectId(report.author_id, "author ID");
  report.img = validateArray(report.img, "images");
  return report;
};

export const limitDesc = (result) =>{
  for(let i of result){
    i.desc = i.desc.slice(0,50) + "..."
  }
  return result
}
