var expect = require("chai").expect;

const Book = require("../models/bookModel");
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function(app) {
  app
    .route("/api/books")
    .get(async (req, res, next) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const allBooks = await Book.find().select("-__v");
        if (!allBooks) {
          return res.send("No books exist");
        }
        return res.json([...allBooks]);
      } catch (err) {
        err = new Error("Cannot get books");
        return next(err);
      }
    })

    .post(async (req, res, next) => {
      const title = req.body.title;
      let newBook = new Book({
        title
      });
      try {
        const result = await newBook.save();
        return res.status(201).json({
          _id: result._id,
          title: result.title,
          comments: result.comments
        });
      } catch (err) {
        err = new Error("Post failed");
        return next(err);
      }
      //response will contain new book object including atleast _id and title
    })

    .delete(function(req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function(req, res) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
