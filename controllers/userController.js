const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports = {
  viewUser: async (req, res, next) => {
    try {
      if (!req.session.loggedin) {
        res.redirect("/login");
      }

      const users = await User.find();

      const messageFlash = req.flash("message");
      const statusFlash = req.flash("status");

      const alert = {
        message: messageFlash.length > 0 ? messageFlash : undefined,
        status: statusFlash.length > 0 ? statusFlash : undefined,
      };

      return res.render("users", {
        users,
        alert,
        session: req.session,
        title: "Users",
        onReport: null,
      });
    } catch (err) {
      console.log(err);
      return res.redirect("/users");
    }
  },
  addUser: async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        username,
        password,
        confirmPassword,
        address,
        email,
        phone,
        role,
        isActive,
      } = req.body;

      console.log(req.body);

      const booleanIsActive =
        isActive == "1" || isActive == undefined ? true : false;

      // Is username available?

      // Is password matched?
      if (password != confirmPassword) {
        req.flash("message", "The passwords are not matched");
        req.flash("status", "danger");
        return res.redirect("/users");
      }

      // Is email used?

      const salt = await bcrypt.genSaltSync();
      const hashedPassword = await bcrypt.hashSync(password, salt);

      await User.create({
        name: { firstName, lastName },
        username,
        password: hashedPassword,
        address,
        email,
        phone,
        role,
        isActive: booleanIsActive,
      });

      req.flash("message", "Success add a user");
      req.flash("status", "success");
      return res.redirect("/users");
    } catch (err) {
      console.log(err);
      req.flash("message", `${err.message}`);
      req.flash("status", "danger");
      return res.redirect("/users");
    }
  },
  editUser: async (req, res, next) => {
    try {
      let updateData = req.body;
      updateData.name = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      };

      if (req.body.password != req.body.confirmPassword) {
        req.flash("message", "The passwords are not matched");
        req.flash("status", "danger");
        return res.redirect("/users");
      }

      const salt = await bcrypt.genSaltSync();
      const hashedPassword = await bcrypt.hashSync(req.body.password, salt);

      updateData.password = hashedPassword;

      delete updateData.firstName;
      delete updateData.lastName;
      console.log(updateData);

      await User.findByIdAndUpdate(req.params.id, updateData);

      req.flash("message", "Success edit a user");
      req.flash("status", "success");
      return res.redirect("/users");
    } catch (err) {
      console.error(err);
      req.flash("message", `${err.message}`);
      req.flash("status", "danger");
      return res.redirect("/users");
    }
  },
  removeUser: async (req, res, next) => {
    try {
      await User.findByIdAndRemove(req.params.id);

      req.flash("message", "Success delete a user");
      req.flash("status", "success");
      return res.redirect("/users/");
    } catch (err) {
      console.error(err);
      req.flash("message", `${err.message}`);
      req.flash("status", "danger");
      return res.redirect("/users");
    }
  },
};
