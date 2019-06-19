var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("POST /api/issues/{project} => object with issue data", function() {
    test("Every field filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          _id: "5d0a22ec928b782b78c34742",
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);

          done();
        });
    });

    test("Required fields filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Furkan"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);

          done();
        });
    });

    test("Missing required fields", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({})
        .end(function(err, res) {
          assert.notEqual(res.status, 200);

          done();
        });
    });
  });

  suite("PUT /api/issues/{project} => text", function() {
    test("No body", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({})
        .end(function(err, res) {
          console.log(res.body);
          assert.equal(res.status, 500);
          assert.equal(res.body.message, "could not update undefined");

          done();
        });
    });

    test("One field to update", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          issue_text: "Somethink"
        })
        .end(function(err, res) {
          console.log(res.body);
          assert.equal(res.status, 500);
          assert.equal(res.body.message, "could not update undefined");

          done();
        });
    });

    test("Multiple fields to update", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          issue_text: "Somethink",
          issue_title: "Someone",
          _id: "5d0a22ec928b782b78c34742"
        })
        .end(function(err, res) {
          console.log(res.body);
          assert.equal(res.status, 500);
          assert.equal(res.body.message, "could not update undefined");

          done();
        });
    });
  });

  suite(
    "GET /api/issues/{project} => Array of objects with issue data",
    function() {
      test("No filter", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query()
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            done();
          });
      });

      test("One filter", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ open: true })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            done();
          });
      });

      test("Multiple filters (test for multiple fields you know will be in the db for a return)", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ open: true, assigned_to: "Furkan Özbek" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            done();
          });
      });
    }
  );

  suite("DELETE /api/issues/{project} => text", function() {
    test("No _id", function(done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({})
        .end((err, res) => {
          assert.equal(res.body.message, "could not delete undefined");
          assert.equal(res.status, 500);
          done();
        });
    });

    test("Valid _id", function(done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({ _id: "5d0a2359a89f581e8ceda5df" })
        .end((err, res) => {
          assert.equal(res.body.message, "Successfully deleted");
          assert.equal(res.status._id, "5d0a2359a89f581e8ceda5df");
          done();
        });
    });
  });
});
