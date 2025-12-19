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

const validateAlphaLike = (value, name, {minLength = 2} = {}) => {
  value = validateTrimmableString(value, name);
  if (value.length < minLength) {
    throw new InvalidInputError(`${name} must be at least ${minLength} characters long.`);
  }
  // Letters with common punctuation/spaces (no digits)
  if (!/^[A-Za-z][A-Za-z .'-]*$/.test(value)) {
    throw new InvalidInputError(`${name} must contain only letters and spaces.`);
  }
  return value;
};

export const validateUsername = (username) => {
  username = validateWord(username, "username");
  if (username.length < 3)
    throw new InvalidInputError("Username must be at least 3 characters long.");
  if (username.length > 20)
    throw new InvalidInputError("Username must be at most 20 characters long.");
  if (!/^[A-Za-z0-9]+$/.test(username))
    throw new InvalidInputError("Username must contain only letters and numbers.");
  if (!/[A-Za-z]/.test(username))
    throw new InvalidInputError("Username must contain at least one letter.");
  return username;
};

export const validatePassword = (password) => {
  password = validateString(password, "password");
  if (password.length < 8)
    throw new InvalidInputError("Password must be at least 8 characters long.");
  if (/\s/.test(password))
    throw new InvalidInputError("Password must not contain whitespace.");
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password))
    throw new InvalidInputError("Password must contain at least one letter and one number.");
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

export const validateAge = (age) => {
  age = validateNumber(age, "age");
  if (!Number.isInteger(age))
    throw new InvalidInputError("Age must be an integer.");
  if (age < 13)
    throw new InvalidInputError("Age must be at least 13.");
  if (age > 120)
    throw new InvalidInputError("Age must be a realistic value.");
  return age;
};

export const validateZipcode = (zipcode) => {
  zipcode = validateTrimmableString(zipcode, "zipcode");
  if (!/^\d{5}$/.test(zipcode)) {
    throw new InvalidInputError("ZIP code must be 5 digits.");
  }
  return zipcode;
};

export const validateName = (value, name) => {
  return validateAlphaLike(value, name, {minLength: 2});
};

export const validateCity = (city) => {
  return validateAlphaLike(city, "city", {minLength: 2});
};

export const validateArea = (area) => {
  return validateAlphaLike(area, "neighborhood/area", {minLength: 2});
};

export const validateState = (state) => {
  state = validateAlphaLike(state, "state", {minLength: 2});
  // Allow full names too, but prefer 2-letter codes; normalize in data layer if needed.
  return state;
};

export const validateReportTitle = (title) => {
  title = validateTrimmableString(title, "title");
  if (title.length < 5)
    throw new InvalidInputError("Title must be at least 5 characters long.");
  return title;
};

export const validateCrimeType = (crime) => {
  crime = validateTrimmableString(crime, "crime");
  if (crime.length < 3)
    throw new InvalidInputError("Crime type must be at least 3 characters long.");
  return crime;
};

export const validateDescription = (desc) => {
  desc = validateTrimmableString(desc, "description");
  if (desc.length < 15)
    throw new InvalidInputError("Description must be at least 15 characters long.");
  return desc;
};

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
  report.title = validateReportTitle(report.title);
  report.desc = validateDescription(report.desc);
  report.crime = validateCrimeType(report.crime);
  report.state = validateState(report.state);
  report.city = validateCity(report.city);
  report.area = validateArea(report.area);
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
