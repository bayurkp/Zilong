const createError = require("http-errors");
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const logger = require("morgan");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books");
const usersRouter = require("./routes/users");
const transactionsRouter = require("./routes/transactions");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cookieParser("zilong secret"));
app.use(
  session({
    secret: "zilong secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  }),
);
app.use(flash());

app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://127.0.0.1:27017/zilonglocal", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/", indexRouter);
app.use("/admin/books", booksRouter);
app.use("/admin/users", usersRouter);
app.use("/admin/transactions", transactionsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
  next();
});

module.exports = app;
