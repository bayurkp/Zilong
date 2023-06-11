const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports = {
  viewUser: async (req, res, next) => {
    try {
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
        title: "Users",
      });
    } catch (err) {
      console.log(err);
      return res.redirect("/admin/users/");
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

      const booleanIsActive = isActive === "1" ? true : false;

      // Is username available?

      // Is password matched?
      if (password != confirmPassword) {
        req.flash("message", "The passwords are not matched");
        req.flash("status", "danger");
        return res.redirect("/admin/users/");
      }

      // Is email used?

      const salt = await bcrypt.genSaltSync();
      const hashedPassword = await bcrypt.hashSync(password, salt);

      await User.create({
        firstName,
        lastName,
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
      return res.redirect("/admin/users/");
    } catch (err) {
      console.log(err);
      req.flash("message", `${err.message}`);
      req.flash("status", "danger");
      return res.redirect("/admin/users/");
    }
  },
  editUser: async (req, res, next) => {
    try {
      await User.findByIdAndUpdate(req.params.id, req.body);

      req.flash("message", "Success edit a user");
      req.flash("status", "success");
      return res.redirect("/admin/users/");
    } catch (err) {
      console.error(err);
      req.flash("message", `${err.message}`);
      req.flash("status", "danger");
      return res.redirect("/admin/users/");
    }
  },
  removeUser: async (req, res, next) => {
    try {
      await User.findByIdAndRemove(req.params.id);

      req.flash("message", "Success delete a user");
      req.flash("status", "success");
      return res.redirect("/admin/users/");
    } catch (err) {
      console.error(err);
      req.flash("message", `${err.message}`);
      req.flash("status", "danger");
      return res.redirect("/admin/users/");
    }
  },
};
