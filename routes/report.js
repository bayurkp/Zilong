const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Book = require("../models/Book");
const moment = require("moment");
const url = require("url");

router.get("/", async (req, res, next) => {
  try {
    let alert = {
      message: null,
      status: null,
    };

    let $query = {};

    const allBooks = await Book.find();
    const allUsers = await User.find();
    const allCashiers = await User.find({ role: "cashier" });
    const allMembers = await User.find({ role: "member" });

    return res.render("report.ejs", {
      allBooks,
      allUsers,
      allCashiers,
      allMembers,
      session: req.session,
      title: "Report",
      alert,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/books", async (req, res, next) => {
  try {
    let alert = {
      message: null,
      status: null,
    };

    const query = req.query;

    let $query = {};

    if (query.title)
      $query.title = { $regex: `.*${query.title}.*`, $options: "i" };

    if (query.author)
      $query.author = { $regex: `.*${query.author}.*`, $options: "i" };

    if (query.publisher)
      $query.publisher = { $regex: `.*${query.publisher}.*`, $options: "i" };

    if (query.publicationYear) {
      let temp = query.publicationYear.split("-");
      $query.publicationYear = {};
      if (temp[0] === "byCondition") {
        let operator = "$" + temp[1];
        $query.publicationYear[operator] = parseInt(temp[2]);
      } else {
        $query.publicationYear.$gte = parseInt(temp[1]);
        $query.publicationYear.$lte = parseInt(temp[2]);
      }
    }

    if (query.numberOfPages) {
      let temp = query.numberOfPages.split("-");
      $query.numberOfPages = {};
      if (temp[0] === "byCondition") {
        let operator = "$" + temp[1];
        $query.numberOfPages[operator] = parseInt(temp[2]);
      } else {
        $query.numberOfPages.$gte = parseInt(temp[1]);
        $query.numberOfPages.$lte = parseInt(temp[2]);
      }
    }

    if (query.price) {
      let temp = query.price.split("-");
      $query.price = {};
      if (temp[0] === "byCondition") {
        let operator = "$" + temp[1];
        $query.price[operator] = parseInt(temp[2]);
      } else {
        $query.price.$gte = parseInt(temp[1]);
        $query.price.$lte = parseInt(temp[2]);
      }
    }

    if (query.stock) {
      let temp = query.stock.split("-");
      $query.stock = {};
      if (temp[0] === "byCondition") {
        let operator = "$" + temp[1];
        $query.stock[operator] = parseInt(temp[2]);
      } else {
        $query.stock.$gte = parseInt(temp[1]);
        $query.stock.$lte = parseInt(temp[2]);
      }
    }

    if (query.genre) {
      if (!Array.isArray(query.genre)) {
        $query.genre = query.genre;
      } else {
        $query.genre = {};
        $query.genre.$all = query.genre;
      }
    }

    console.log($query);

    const books =
      Object.keys($query).length != 0 ? await Book.find($query) : [];

    const allBooks = await Book.find();
    const allUsers = await User.find();
    const allCashiers = await User.find({ role: "cashier" });
    const allMembers = await User.find({ role: "member" });

    return res.render("books.ejs", {
      allBooks,
      allUsers,
      allCashiers,
      allMembers,
      books,
      alert,
      session: req.session,
      title: "Report",
      onReport: true,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/users", async (req, res, next) => {
  try {
    let alert = {
      message: null,
      status: null,
    };

    const query = req.query;

    let $query = {};

    if (query.firstName) {
      $query["name.firstName"] = {
        $regex: `.*${query.firstName}.*`,
        $options: "i",
      };
    }

    if (query.lastName) {
      $query["name.lastName"] = {
        $regex: `.*${query.lastName}.*`,
        $options: "i",
      };
    }

    if (query.username) $query.username = query.username;
    if (query.address) $query.address = query.address;
    if (query.email) $query.email = query.email;
    if (query.phone) $query.phone = query.phone;
    if (query.role) $query.role = query.role;
    if (query.isActive) {
      if (query.isActive == 1) $query.isActive = true;
      else if (query.isActive == 0) $query.isActive = false;
    }

    console.log($query);

    const users =
      Object.keys($query).length != 0 ? await User.find($query) : [];

    const allBooks = await Book.find();
    const allUsers = await User.find();
    const allCashiers = await User.find({ role: "cashier" });
    const allMembers = await User.find({ role: "member" });

    return res.render("users.ejs", {
      allBooks,
      allUsers,
      allCashiers,
      allMembers,
      users,
      alert,
      session: req.session,
      title: "Report",
      onReport: true,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/transactions", async (req, res, next) => {
  try {
    let alert = {
      message: null,
      status: null,
    };

    const query = req.query;

    let $query = {};

    if (query.memberId) $query.memberId = query.memberId;
    if (query.cashierId) $query.cashierId = query.cashierId;
    if (query.total) {
      let temp = query.total.split("-");
      $query.total = {};
      if (temp[0] === "byCondition") {
        let operator = "$" + temp[1];
        $query.total[operator] = parseInt(temp[2]);
      } else {
        $query.total.$gte = parseInt(temp[1]);
        $query.total.$lte = parseInt(temp[2]);
      }
    }
    if (query.bookId) {
      if (!Array.isArray(query.bookId)) {
        $query["details.bookId"] = query.bookId;
      } else {
        $query["details.bookId"] = {};
        $query["details.bookId"].$all = query.bookId;
      }
    }
    if (query.priceInDetail) {
      let temp = query.priceInDetail.split("-");
      $query["details.price"] = {};
      if (temp[0] === "byCondition") {
        let operator = "$" + temp[1];
        $query["details.price"][operator] = parseInt(temp[2]);
      } else {
        $query["details.price"].$gte = parseInt(temp[1]);
        $query["details.price"].$lte = parseInt(temp[2]);
      }
    }
    if (query.discountInDetail) {
      let temp = query.discountInDetail.split("-");
      $query["details.discount"] = {};
      if (temp[0] === "byCondition") {
        let operator = "$" + temp[1];
        $query["details.discount"][operator] = parseInt(temp[2]);
      } else {
        $query["details.discount"].$gte = parseInt(temp[1]);
        $query["details.discount"].$lte = parseInt(temp[2]);
      }
    }
    if (query.quantityInDetail) {
      let temp = query.quantityInDetail.split("-");
      $query["details.quantity"] = {};
      if (temp[0] === "byCondition") {
        let operator = "$" + temp[1];
        $query["details.quantity"][operator] = parseInt(temp[2]);
      } else {
        $query["details.quantity"].$gte = parseInt(temp[1]);
        $query["details.quantity"].$lte = parseInt(temp[2]);
      }
    }
    if (query.timestamp) {
      let temp = query.timestamp.split("-");
      $query.createdAt = {};
      if (temp[0] === "byCondition") {
        let operator = "$" + temp[1];
        $query.createdAt[operator] = new Date(temp[2]);
      } else {
        $query.createdAt.$gte = new Date(temp[1]);
        $query.createdAt.$lte = new Date(temp[2]);
      }
    }

    console.log($query);

    const transactions =
      Object.keys($query).length != 0 ? await Transaction.find($query) : [];

    const allBooks = await Book.find();
    const allUsers = await User.find();
    const allCashiers = await User.find({ role: "cashier" });
    const allMembers = await User.find({ role: "member" });

    const cashiers = await User.find({ role: "cashier", isActive: true });
    const members = await User.find({ role: "member", isActive: true });
    const books = await Book.find();

    return res.render("transactions.ejs", {
      moment,
      allBooks,
      allUsers,
      allCashiers,
      allMembers,
      transactions,
      cashiers,
      members,
      books,
      alert,
      session: req.session,
      title: "Report",
      onReport: true,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/books", (req, res, next) => {
  const body = req.body;
  console.log(body);
  let query = {};

  if (body.title) query.title = body.title;
  if (body.author) query.author = body.author;
  if (body.publisher) query.publisher = body.publisher;

  if (body.publicationYear) {
    if (
      body.publicationYear[0] == "byCondition" &&
      body.publicationYear[1] &&
      body.publicationYear[2]
    ) {
      // by Condition
      query.publicationYear =
        "byCondition-" +
        body.publicationYear[1] +
        "-" +
        body.publicationYear[2];
    } else if (
      body.publicationYear[0] == "byRange" &&
      body.publicationYear[3] &&
      body.publicationYear[4]
    ) {
      // by Range
      query.publicationYear =
        "byRange-" + body.publicationYear[3] + "-" + body.publicationYear[4];
    }
  }

  if (body.numberOfPages) {
    if (
      body.numberOfPages[0] == "byCondition" &&
      body.numberOfPages[1] &&
      body.numberOfPages[2]
    ) {
      // by Condition
      query.numberOfPages =
        "byCondition-" + body.numberOfPages[1] + "-" + body.numberOfPages[2];
    } else if (
      body.numberOfPages[0] == "byRange" &&
      body.numberOfPages[3] &&
      body.numberOfPages[4]
    ) {
      // by Range
      query.numberOfPages =
        "byRange-" + body.numberOfPages[3] + "-" + body.numberOfPages[4];
    }
  }

  if (body.price) {
    if (body.price[0] == "byCondition" && body.price[1] && body.price[2]) {
      // by Condition
      query.price = "byCondition-" + body.price[1] + "-" + body.price[2];
    } else if (body.price[0] == "byRange" && body.price[3] && body.price[4]) {
      // by Range
      query.price = "byRange-" + body.price[3] + "-" + body.price[4];
    }
  }

  if (body.stock) {
    if (body.stock[0] == "byCondition" && body.stock[1] && body.stock[2]) {
      // by Condition
      query.stock = "byCondition-" + body.stock[1] + "-" + body.stock[2];
    } else if (body.stock[0] == "byRange" && body.stock[3] && body.stock[4]) {
      // by Range
      query.stock = "byRange-" + body.stock[3] + "-" + body.stock[4];
    }
  }

  if (body.genre) query.genre = body.genre;

  console.log({ query });
  res.redirect(
    url.format({
      pathname: "/report/books/",
      query,
    }),
  );
});

router.post("/users", (req, res, next) => {
  const body = req.body;
  console.log(body);
  let query = {};

  if (body.firstName) query.firstName = body.firstName;
  if (body.lastName) query.lastName = body.lastName;
  if (body.username) query.username = body.username;
  if (body.address) query.address = body.address;
  if (body.email) query.email = body.email;
  if (body.phone) query.phone = body.phone;
  if (body.role) query.role = body.role;
  if (body.isActive) query.isActive = body.isActive;

  console.log({ query });
  res.redirect(
    url.format({
      pathname: "/report/users/",
      query,
    }),
  );
});

router.post("/transactions", (req, res, next) => {
  const body = req.body;
  console.log(body);
  let query = {};

  if (body.memberId) query.memberId = body.memberId;
  if (body.cashierId) query.cashierId = body.cashierId;
  if (body.total) {
    if (body.total[0] == "byCondition" && body.total[1] && body.total[2]) {
      // by Condition
      query.total = "byCondition-" + body.total[1] + "-" + body.total[2];
    } else if (body.total[0] == "byRange" && body.total[3] && body.total[4]) {
      // by Range
      query.total = "byRange-" + body.total[3] + "-" + body.total[4];
    }
  }
  if (body.bookId) query.bookId = body.bookId;
  if (body.priceInDetail) {
    if (
      body.priceInDetail[0] == "byCondition" &&
      body.priceInDetail[1] &&
      body.priceInDetail[2]
    ) {
      // by Condition
      query.priceInDetail =
        "byCondition-" + body.priceInDetail[1] + "-" + body.priceInDetail[2];
    } else if (
      body.priceInDetail[0] == "byRange" &&
      body.priceInDetail[3] &&
      body.priceInDetail[4]
    ) {
      // by Range
      query.priceInDetail =
        "byRange-" + body.priceInDetail[3] + "-" + body.priceInDetail[4];
    }
  }
  if (body.discountInDetail) {
    if (
      body.discountInDetail[0] == "byCondition" &&
      body.discountInDetail[1] &&
      body.discountInDetail[2]
    ) {
      // by Condition
      query.discountInDetail =
        "byCondition-" +
        body.discountInDetail[1] +
        "-" +
        body.discountInDetail[2];
    } else if (
      body.discountInDetail[0] == "byRange" &&
      body.discountInDetail[3] &&
      body.discountInDetail[4]
    ) {
      // by Range
      query.discountInDetail =
        "byRange-" + body.discountInDetail[3] + "-" + body.discountInDetail[4];
    }
  }
  if (body.quantityInDetail) {
    if (
      body.quantityInDetail[0] == "byCondition" &&
      body.quantityInDetail[1] &&
      body.quantityInDetail[2]
    ) {
      // by Condition
      query.quantityInDetail =
        "byCondition-" +
        body.quantityInDetail[1] +
        "-" +
        body.quantityInDetail[2];
    } else if (
      body.quantityInDetail[0] == "byRange" &&
      body.quantityInDetail[3] &&
      body.quantityInDetail[4]
    ) {
      // by Range
      query.quantityInDetail =
        "byRange-" + body.quantityInDetail[3] + "-" + body.quantityInDetail[4];
    }
  }

  if (body.timestamp) {
    if (
      body.timestamp[0] == "byCondition" &&
      body.timestamp[1] &&
      body.timestamp[2]
    ) {
      // by Condition
      query.timestamp =
        "byCondition-" + body.timestamp[1] + "-" + body.timestamp[2];
    } else if (
      body.timestamp[0] == "byRange" &&
      body.timestamp[3] &&
      body.timestamp[4]
    ) {
      // by Range
      query.timestamp =
        "byRange-" + body.timestamp[3] + "-" + body.timestamp[4];
    }
  }

  console.log({ query });

  res.redirect(
    url.format({
      pathname: "/report/transactions/",
      query,
    }),
  );
});

module.exports = router;
