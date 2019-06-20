var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function(done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "num_of_comments",
          "Books in array should contain num_of_comments"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function() {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: Math.random().toString() })
            .end((err, res) => {
              console.log(res.body);
              assert.equal(res.status, 201);
              done();
            });
        });

        test("Test POST /api/books with no title given", function(done) {
          //done();
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "random" })
            .end((err, res) => {
              console.log(res.body);
              assert.equal(res.body.message, "Post failed");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "num_of_comments",
              "Books in array should contain num_of_comments"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with id not in db", function(done) {
        //done();
        chai
          .request(server)
          .get("/api/books/12121")
          .end((err, res) => {
            assert.equal(res.status, 500);
            assert.equal(res.body.message, "Cannot get 12121");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        //done();
        chai
          .request(server)
          .get("/api/books/5d0b6f7f6a38f8135cf7f41f")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "comments");
            assert.property(res.body, "_id");
            assert.property(res.body, "title");
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", function(done) {
          //done();
          chai
            .request(server)
            .post("/api/books/5d0b6f7f6a38f8135cf7f41f")
            .send({ comment: "Test comment" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, "comments");
              assert.property(res.body, "id");
              assert.property(res.body, "title");
              assert.property(res.body, "num_of_comments");
              done();
            });
        });
      }
    );
  });
});
