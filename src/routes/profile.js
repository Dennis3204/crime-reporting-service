import { Router } from "express";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../helpers/validation.js";
import { RenderableError } from "../helpers/errors.js";

const router = Router();

router.get("/", async (req, res) => {
  if (!req.session.user) {
      return res.redirect("/login");
  }
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(req.session.user._id) });

  return res.render("profile", {
      title: "Your Profile",
      user: user,
      totalReports: user.reports.length
  });
});

router.post("/", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    let { area, city, state, zipcode } = req.body;
    try {
        area = validation.validateTrimmableString(area, "area");
        city = validation.validateTrimmableString(city, "city");
        state = validation.validateTrimmableString(state, "state");
        zipcode = validation.validateZipcode(zipcode);
    } catch (e) {
        return res.status(400).render("profile", {
            title: "Your Profile",
            user: req.session.user,
            error: e.message
        });
    }

    const userCollection = await users();

    await userCollection.updateOne(
        { _id: new ObjectId(req.session.user._id) },
        {
            $set: {
                "location.area": area,
                "location.city": city,
                "location.state": state,
                "location.zipcode": zipcode
            }
        }
    );
    const updatedUser = await userCollection.findOne({
      _id: new ObjectId(req.session.user._id)
    });

    req.session.user.location = updatedUser.location;

    return res.render("profile", {title: "Your Profile", user: updatedUser, totalReports: updatedUser.reports.length, success: "Profile updated successfully!!"});
});

export default router;
