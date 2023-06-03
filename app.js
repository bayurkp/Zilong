const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books");
const membersRouter = require("./routes/members");
const employeesRouter = require("./routes/employees");
const transactionsRouter = require("./routes/transactions");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://127.0.0.1:27017/zilonglocal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
    }),
);
app.use(flash());

app.use("/", indexRouter);
app.use("/books", booksRouter);
app.use("/members", membersRouter);
app.use("/employees", employeesRouter);
app.use("/transactions", transactionsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    ``;

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
