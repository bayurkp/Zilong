const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Book = require("../models/Book");
const moment = require("moment");

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
        session: req.session,
        moment,
        title: "Transactions",
        onReport: null,
      });
    } catch (err) {
      console.log(err);
      return res.redirect("/");
    }
  },
  addTransaction: async (req, res) => {
    try {
      let total = 0;
      let details = [];

      if (!Array.isArray(req.body.bookId)) {
        let book = await Book.findById(req.body.bookId);
        let data = {
          bookId: book._id,
          price: book.price,
          discount: req.body.discount ? req.body.discount : 0,
          quantity: req.body.quantity,
        };
        details.push(data);

        if (data.discount == 0) total += data.price * data.quantity;
        else total += data.price * data.quantity * (data.discount / 100);
      } else {
        for (let i = 0; i < req.body.bookId.length; i++) {
          let book = await Book.findById(req.body.bookId[i]);
          let data = {
            bookId: book._id,
            price: book.price,
            discount: req.body.discount[i] ? req.body.discount[i] : 0,
            quantity: req.body.quantity[i],
          };
          details.push(data);

          if (data.discount == 0) total += data.price * data.quantity;
          else total += data.price * data.quantity * (data.discount / 100);
        }
      }

      await Transaction.create({
        memberId: req.body.memberId,
        cashierId: req.body.cashierId,
        total,
        details,
      });

      req.flash("message", "Success add a transaction");
      req.flash("status", "success");
      return res.redirect("/transactions");
    } catch (err) {
      req.flash("message", `${err.message}`);
      req.flash("status", "danger");
      return res.redirect("/transactions");
    }
  },
  editTransaction: async (req, res) => {
    try {
      console.log(req.body);
      let total = 0;
      let details = [];

      if (!Array.isArray(req.body.bookId)) {
        let book = await Book.findById(req.body.bookId);
        let data = {
          bookId: book._id,
          price: req.body.price,
          discount: req.body.discount ? req.body.discount : 0,
          quantity: req.body.quantity,
        };
        details.push(data);

        if (data.discount == 0) total += data.price * data.quantity;
        else total += data.price * data.quantity * (data.discount / 100);
      } else {
        for (let i = 0; i < req.body.bookId.length; i++) {
          let book = await Book.findById(req.body.bookId[i]);
          let data = {
            bookId: book._id,
            price: req.body.price[i],
            discount: req.body.discount[i] ? req.body.discount[i] : 0,
            quantity: req.body.quantity[i],
          };
          details.push(data);
          console.log({ discount: data.discount });

          if (data.discount == 0) total += data.price * data.quantity;
          else total += data.price * data.quantity * (data.discount / 100);
        }
      }

      await Transaction.findByIdAndUpdate(req.params.id, {
        memberId: req.body.memberId,
        cashierId: req.body.cashierId,
        total,
        details,
      });

      req.flash("message", "Success edit a transaction");
      req.flash("status", "success");
      return res.redirect("/transactions");
    } catch (err) {
      req.flash("message", `${err.message}`);
      req.flash("status", "danger");
      return res.redirect("/transactions");
    }
  },
  removeTransaction: async (req, res) => {
    try {
      console.log(req.params.id);
      await Transaction.findByIdAndRemove(req.params.id);

      req.flash("message", "Success remove a transaction");
      req.flash("status", "warning");
      return res.redirect("/transactions");
    } catch (err) {
      req.flash("message", `${err.message}`);
      req.flash("status", "danger");
      return res.redirect("/transactions");
    }
  },
};
