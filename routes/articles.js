const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const flash = require("connect-flash");

// Bring in Article Model
let Article = require("../models/article");

// Add Route
router.get("/add", (req, res) => {
  res.render("add_article", {
    title: "Add Articles",
  });
});

// Add Submit POST Route
router.post(
  "/add",
  [
    check("title").isLength({ min: 1 }).trim().withMessage("Title required"),
    check("author").isLength({ min: 1 }).trim().withMessage("Author required"),
    check("body").isLength({ min: 1 }).trim().withMessage("Body required"),
  ],
  (req, res, next) => {
    let article = new Article({
      title: req.body.title,
      author: req.body.author,
      body: req.body.body,
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.render("add_article", {
        title: "Add Articles",
        article: article,
        errors: errors.mapped(),
      });
    } else {
      article.title = req.body.title;
      article.author = req.body.author;
      article.body = req.body.body;

      article.save((err) => {
        if (err) throw err;
        req.flash("success", "Article Added");
        res.redirect("/");
      });
    }
  }
);


// Show Articles Route MyCode
// router.get("/article/:id", (req, res) => {
//     let article = Article.find({_id: 'req.params.id'})
//     res.render('article', {
//         article: article
//     })
// })

// Update Single Article
router.get("/edit/:id", (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render("edit_article", {
        title: "Edit Article",
      article: article,
    });
  });
});

// Update And Submit POST Route
router.post("/edit/:id", (req, res) => {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  
  let query = { _id: req.params.id };
  
  Article.update(query, article, (err) => {
      if (err) {
      console.log(err);
    } else {
      req.flash("success", "Updated Successfully!!");
      res.redirect("/");
    }
  });
});

// Delete Article with My Simple Code
// router.get("/article/delete/:id", (req, res) => {
//     let query = {_id:req.params.id}
//     Article.remove(query, (err) => {
//         res.redirect("/");
//     })
// })

router.delete("/:id", (req, res) => {
  let query = { _id: req.params.id };

  Article.remove(query, (err) => {
    if (err) {
      console.log(err);
    }
    res.send("Success");
});
});

// Show Articles Route Brad Code
router.get("/:id", (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render("article", {
      article: article,
    });
  });
});


module.exports = router;
