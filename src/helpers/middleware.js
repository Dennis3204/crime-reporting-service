const requireLogin = async (req, res, next) => {
  if (req.session.user === undefined)
    return res.redirect("/login");
  next();
};

const configureMiddleware = (app) => {
  app.use("/search", requireLogin);
  app.use("/map", requireLogin);
  app.use("/reports", requireLogin);
  app.use("/logout", requireLogin);
};

export default configureMiddleware;
