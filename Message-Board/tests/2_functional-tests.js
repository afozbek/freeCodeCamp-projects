/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    suite("POST", function() {
      test("TITLE COME HERE", done => {
        chai
          .request(server)
          .post("/api/threads/Furkan3")
          .set({ field1: "something" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("GET", function() {
      test("TITLE COME HERE", done => {
        chai
          .request(server)
          .get("/api/threads/Furkan3")
          .query({ field1: "something" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("TITLE COME HERE", done => {
        chai
          .request(server)
          .delete("/api/threads/Furkan3")
          .set({ field1: "something" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("PUT", function() {
      test("TITLE COME HERE", done => {
        chai
          .request(server)
          .put("/api/threads/Furkan3")
          .set({ field1: "something" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {
      test("TITLE COME HERE", done => {
        chai
          .request(server)
          .get("/api/replies/Furkan3")
          .set({ field1: "something" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("GET", function() {
      test("TITLE COME HERE", done => {
        chai
          .request(server)
          .get("/api/replies/Furkan3")
          .query({ field1: "something" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("PUT", function() {
      test("TITLE COME HERE", done => {
        chai
          .request(server)
          .put("/api/replies/Furkan3")
          .set({ field1: "something" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("TITLE COME HERE", done => {
        chai
          .request(server)
          .delete("/api/replies/Furkan3")
          .set({ field1: "something" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });
  });
});
