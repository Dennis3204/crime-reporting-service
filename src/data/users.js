import bcrypt from "bcrypt";
import { users } from "../config/mongoCollections.js";
import * as validation from "../helpers/validation.js";
import * as errors from "../helpers/errors.js";

export const getUsername = async (id) => {
  id = validation.validateObjectId(id, "user ID");
  const userCollection = await users();
  const result = await userCollection.findOne({_id: id}, {username: 1});
  if (result === null)
    throw new errors.NotFoundError("User not found.");
  return result.username;
};

export const createUser = async (
  username,
  first_name,
  last_name,
  age,
  password) => {

  username = validation.validateUsername(username).toLowerCase();
  password = validation.validatePassword(password);
  first_name = validation.validateTrimmableString(first_name, "first name");
  last_name = validation.validateTrimmableString(last_name, "last name");
  age = validation.validateNumber(age, "age");

  const userCollection = await users();
  const usernameExists = await userCollection.findOne({ username });

  if (usernameExists) {
    throw new errors.BadRequestError("Username already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    username,
    first_name,
    last_name,
    age,
    password: hashedPassword,
    reports: [],
    post: [],
    comments_reports: [],
    comments_posts: []
  };

  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.insertedId) {
    throw new Error("Could not create user.");
  }
  newUser._id = insertInfo.insertedId;
  return newUser;
};

export const checkUser = async (username, password) => {

  username = validation.validateTrimmableString(username, "username").toLowerCase();
  password = validation.validateString(password, "password");

  const userCollection = await users();
  const user = await userCollection.findOne({ username });
  if (!user) {
    throw new errors.UnauthorizedError("Either the username or password is invalid.");
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new errors.UnauthorizedError("Either the username or password is invalid.");
  }

  return user;
};
