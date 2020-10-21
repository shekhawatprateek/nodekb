const express = require("express");
const path = require("path");
let mongoose = require("mongoose");
const bodyParser = require("body-parser");
var session = require("express-session");
const { check, validationResult } = require("express-validator");
const flash = require("connect-flash");

mongoose.connect("mongodb://localhost/nodekb");
let db = mongoose.connection;

// check connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// check for db errors
db.on("error", (err) => {
  console.log(err);
});

// Init App
const app = express();

// Bring in Models
let Article = require("./models/article");

// Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, "public")));

// Express Session Middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Home Route
app.get("/", (req, res) => {
  Article.find({}, function (err, articles) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Articles",
        articles: articles,
      });
    }
  });
});

let articles = require('./routes/articles');
app.use('/articles', articles);

// Start Server
app.listen(3000, () => {
  console.log("Server Started...");
});
