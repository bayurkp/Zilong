const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/", (req, res, next) => {
  if (req.session.loggedin == undefined || req.session.loggedin == false)
    return res.redirect("/login");
  return res.render("index", { title: "Home" });
});

router.get("/login", (req, res) => {
  return res.render("login", { title: "Log In" });
});

router.get("/register", (req, res) => {
  return res.render("register", { title: "Register" });
});

router.post("/auth", async (req, res) => {
  try {
    console.log(req.body);
    const userCreds = await User.findOne({ username: req.body.username });

    console.log({ userCreds });
    const isValid = await bcrypt.compareSync(
      req.body.password,
      userCreds.password,
    );

    console.log(isValid);

    if (isValid) {
      req.session.loggedin = true;
      req.session.username = userCreds.username;
      req.session.role = userCreds.role;
      return res.redirect("/");
    }

    return res.redirect("/login");
  } catch (err) {
    console.error(err);
  }
});

router.delete("/auth", async (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.err(err);
      } else {
        res.redirect("/login", { title: "Log In" });
      }
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
