import { Router } from "express";
import { users } from "../config/mongoCollections.js";
import { reports } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../helpers/validation.js";
import { RenderableError } from "../helpers/errors.js";

const router = Router();

router.get("/", async (req, res) => {
  if (!req.session.user) {
      return res.redirect("/login");
  }
  const userCollection = await users();
  const reportCollection = await reports();
  const user = await userCollection.findOne({ _id: new ObjectId(req.session.user._id) });

  const userReports = await reportCollection.find({ author_id: user._id }).toArray();

  return res.render("profile", {
      title: "Your Profile",
      user: user,
      reports: userReports
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
            reports: [],
            error: e.message
        });
    }

    const userCollection = await users();
    const reportCollection = await reports();

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
    const userReports = await reportCollection.find({ author_id: updatedUser._id }).toArray();

    req.session.user.location = updatedUser.location;

    return res.render("profile", {title: "Your Profile", user: updatedUser, reports: userReports.length, success: "Profile updated successfully!!"});
});

export default router;
