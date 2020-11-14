const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const passport = require('passport');

// Bring in User Model
let User = require("../models/user");

// Register Form
router.get("/register", (req, res) => {
  res.render("register");
});

// Register Process
router.post(
  "/register",
  [
    check("name").isLength({ min: 1 }).trim().withMessage("Name required"),
    check("email").isLength({ min: 1 }).trim().withMessage("Email required"),
    check("email").isEmail().trim().withMessage("Email is not valid"),
    check("password").isLength({ min: 1 }).withMessage("Password required"),
    check("password").custom((value, { req, loc, path }) => {
      if (value !== req.body.password2) {
        // throw error if passwords do not match
        throw new Error("Passwords do not match");
      } else {
        return value;
      }
    }),
  ],
  (req, res, next) => {
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.render("register", {
        newUser: newUser,
        errors: errors.mapped(),
      });
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
          if (err) {
            console.log(err);
          }
          newUser.password = hash;
          newUser.save((err) => {
            if (err) throw err;
            req.flash("success", "You are now registered and can log in");
            res.redirect("/users/login");
          });
        });
      });
    }
  }
);

// Login From 
router.get("/login", (req, res) => {
  res.render("login");
});

// Login Process 
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
 })(req, res, next);
});

router.get('/logout',  (req, res) => {
  req.logout();
  req.flash('success', " You are Logged Out");
  res.redirect('/users/login');
});
  

module.exports = router;
