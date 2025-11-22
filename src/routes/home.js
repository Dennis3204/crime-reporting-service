import {Router} from "express";

const router = new Router();

router.get("/", (req, res) => {
  res.render("home", {title: "CS 546 Final Project"});
});

export default router;
