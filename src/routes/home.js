import {Router} from "express";

const router = new Router();

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

router.get("/", requireLogin, (req, res) => {
  res.render("home", { title: "Home", user: req.session.user});
});

export default router;
