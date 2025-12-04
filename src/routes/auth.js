import { Router } from "express";
import bcrypt from "bcrypt";
import { createUser, checkUser } from "../data/users.js";

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
        return res.status(400).render("signup", {error: e.toString(),title: "Sign Up"});
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
        return res.status(400).render("login", {error: e.toString(),title: "Login"});
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

export default router;
