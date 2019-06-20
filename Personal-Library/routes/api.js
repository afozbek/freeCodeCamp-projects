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
        return res.json(allBooks);
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

    .delete(async (req, res, next) => {
      //if successful response will be 'complete delete successful'
      try {
        const result = await Book.deleteMany({});
        res.json({
          message: "Successfully deleted all records",
          result: `Deleted count: ${result.deletedCount}`
        });
      } catch (err) {
        err = new Error("Deleting all records failed");
        return next(err);
      }
    });

  app
    .route("/api/books/:id")
    .get(async (req, res, next) => {
      const bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await Book.findById(bookid).select(
          "-num_of_comments -__v"
        );
        if (!book) {
          return res.send("book does not exist in db");
        }
        return res.json({
          ...book._doc
        });
      } catch (err) {
        return next(new Error(`Cannot get ${bookid}`));
      }
    })

    .post(async (req, res, next) => {
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      try {
        const updatedBook = await Book.findOneAndUpdate(
          { _id: bookid },
          {
            $push: { comments: comment },
            $inc: { num_of_comments: 1 }
          },
          { new: true }
        );
        let { _id, title, comments } = updatedBook._doc;

        return res.json({
          id: _id,
          title: title,
          comments: comments,
          num_of_comments: comments.length
        });
      } catch (err) {
        return next(new Error("Cannot post comment"));
      }
    })

    .delete(async (req, res, next) => {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        await Book.deleteOne({ _id: bookid });
        res.json({
          message: "Delete successfull"
        });
      } catch (err) {
        return next(new Error("Failed to delete a book " + bookid));
      }
    });
};
