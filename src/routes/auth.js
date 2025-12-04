import { Router } from "express";
import { createUser, checkUser } from "../data/users.js";
import { RenderableError } from "../helpers/errors.js";

const router = Router();

router.get("/signup", (req, res) => {
    res.render("signup", { title: "Sign Up" });
});

router.post("/signup", async (req, res) => {
    let { username, first_name, last_name, age, password } = req.body;
    try {
        const newUser = await createUser(username, first_name, last_name, age, password);
        req.session.user = {_id: newUser._id,username: newUser.username};
        return res.redirect("/");
    } catch (e) {
        const code = e instanceof RenderableError ? e.code : 500;
        return res.status(code).render("signup", {error: e.message, title: "Sign Up"});
    }
});

router.get("/login", (req, res) => {
    res.render("login", { title: "Login" });
});

router.post("/login", async (req, res) => {
    let { username, password } = req.body;
    try {
        const user = await checkUser(username, password);
        req.session.user = {_id: user._id,username: user.username};
        return res.redirect("/");
    } catch (e) {
        const code = e instanceof RenderableError ? e.code : 500;
        return res.status(code).render("login", {error: e.message, title: "Login"});
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

export default router;
