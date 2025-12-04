import { users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export const createUser = async (
  username,
  first_name,
  last_name,
  age,
  password) => {
  if (!username || typeof username !== "string") {
    throw "Username required.";
  }

  username = username.trim().toLowerCase();
  if (username.length < 3) {
    throw "Username must be at least 3 characters long.";
  }

  if (!password || typeof password !== "string") {
    throw "Password required.";
  }
  password = password.trim();
  if (password.length < 8) {
    throw "Password must be at least 8 characters.";
  }
  if (!first_name || typeof first_name !== "string")
    throw "First name required.";
  first_name = first_name.trim();

  if (!last_name || typeof last_name !== "string"){
    throw "Last name required.";
  }
  last_name = last_name.trim();

  if (!age || isNaN(age)) {
    throw "Age must be a number.";
  }
  age = Number(age);

  const userCollection = await users();
  const usernameExists = await userCollection.findOne({ username });

  if (usernameExists) {
    throw "Username already exists.";
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
    throw "Could not create user.";
  }
  newUser._id = insertInfo.insertedId;
  return newUser;
};

export const checkUser = async (username, password) => {
  if (!username || typeof username !== "string") {
    throw "Username required!";
  }
  username = username.trim().toLowerCase();

  if (!password || typeof password !== "string") {
    throw "Password required!";
    
  }
  password = password.trim();

  const userCollection = await users();
  const user = await userCollection.findOne({ username });
  if (!user) {
    throw "Either the username or password is not invalid.";
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw "Either the username or password is not invalid.";
  }

  return user;
};
