const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Book = require("../models/Book");

module.exports = {
  viewTransaction: async (req, res) => {
    try {
      const transactions = await Transaction.find();
      const cashiers = await User.find({ role: "cashier", isActive: true });
      const members = await User.find({ role: "member", isActive: true });
      const books = await Book.find();

      const messageFlash = req.flash("message");
      const statusFlash = req.flash("status");

      const alert = {
        message: messageFlash.length > 0 ? messageFlash : undefined,
        status: statusFlash.length > 0 ? statusFlash : undefined,
      };

      return res.render("transactions", {
        transactions,
        cashiers,
        members,
        books,
        alert,
        title: "Transactions",
      });
    } catch (err) {
      return res.redirect("/");
    }
  },
  addTransaction: async (req, res) => {
    try {
      console.log(req.body);

      // await transaction.create(req.body);

      req.flash("message", "Success add a transaction");
      req.flash("status", "success");
      return res.redirect("/admin/transactions");
    } catch (err) {
      req.flash("message", `${err.message}`);
      req.flash("status", "danger");
      return res.redirect("/admin/transactions");
    }
  },
  // editTransaction: async (req, res) => {
  //   try {
  //     await transaction.findByIdAndUpdate(req.params.id, req.body);

  //     req.flash("message", "Success edit a transaction");
  //     req.flash("status", "success");
  //     return res.redirect("/admin/transactions");
  //   } catch (err) {
  //     req.flash("message", `${err.message}`);
  //     req.flash("status", "danger");
  //     return res.redirect("/admin/transactions");
  //   }
  // },
  // removeTransaction: async (req, res) => {
  //   try {
  //     console.log(req.params.id);
  //     await Transaction.findByIdAndRemove(req.params.id);

  //     req.flash("message", "Success remove a transaction");
  //     req.flash("status", "warning");
  //     return res.redirect("/admin/transactions");
  //   } catch (err) {
  //     req.flash("message", `${err.message}`);
  //     req.flash("status", "danger");
  //     return res.redirect("/admin/transactions");
  //   }
  // },
};
