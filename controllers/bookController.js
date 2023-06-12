const mongoose = require("mongoose");
const Book = require("../models/Book");

module.exports = {
  viewBook: async (req, res) => {
    try {
      const books = await Book.find();

      const messageFlash = req.flash("message");
      const statusFlash = req.flash("status");

      const alert = {
        message: messageFlash.length > 0 ? messageFlash : undefined,
        status: statusFlash.length > 0 ? statusFlash : undefined,
      };

      return res.render("books", { books, alert, role, title: "Books" });
    } catch (err) {
      return res.redirect("/");
    }
  },
  addBook: async (req, res) => {
    try {
      if (req.body.genre.length == 0) {
        req.flash("message", "Genre must be added!");
        req.flash("status", "danger");
        return res.redirect("/admin/books");
      }

      await Book.create(req.body);

      req.flash("message", "Success add a book");
      req.flash("status", "success");
      return res.redirect("/admin/books");
    } catch (err) {
      req.flash("message", `${err.message}`);
      req.flash("status", "danger");
      return res.redirect("/admin/books");
    }
  },
  editBook: async (req, res) => {
    try {
      await Book.findByIdAndUpdate(req.params.id, req.body);

      req.flash("message", "Success edit a book");
      req.flash("status", "success");
      return res.redirect("/admin/books");
    } catch (err) {
      req.flash("message", `${err.message}`);
      req.flash("status", "danger");
      return res.redirect("/admin/books");
    }
  },
  removeBook: async (req, res) => {
    try {
      console.log(req.params.id);
      await Book.findByIdAndRemove(req.params.id);

      req.flash("message", "Success remove a book");
      req.flash("status", "warning");
      return res.redirect("/admin/books");
    } catch (err) {
      req.flash("message", `${err.message}`);
      req.flash("status", "danger");
      return res.redirect("/admin/books");
    }
  },
};
