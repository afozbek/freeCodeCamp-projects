var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    suite("GET", function() {
      test("GET ALL THREADS", done => {
        chai
          .request(server)
          .get("/api/threads/Furkan3")
          .end((err, res) => {
            assert.isArray(res.body, "Is res.body array?");
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("POST", function() {
      test("ADD ALL REQUIRED FIELDS", done => {
        chai
          .request(server)
          .post("/api/threads/Furkan3")
          .send({ text: "Yeni bir thread5", delete_password: "1234" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
      test("ADD SOME REQUIRED FIELDS", done => {
        chai
          .request(server)
          .post("/api/threads/Furkan3")
          .send({ text: "Yeni bir thread3" })
          .end((err, res) => {
            assert.equal(res.status, 500);
            done();
          });
      });
    });

    suite("PUT", function() {
      test("UPDATE THREAD", done => {
        chai
          .request(server)
          .put("/api/threads/Furkan3")
          .send({ thread_id: "5d11cade8e7256265c98b2e2" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("DELETE A THREAD WITH ALL REQUIRED FIELDS", done => {
        chai
          .request(server)
          .delete("/api/threads/Furkan3")
          .send({
            thread_id: "5d11cae18e7256265c98b2e3",
            delete_password: "1234"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });

      test("DELETE A THREAD WITH SOME REQUIRED FIELDS", done => {
        chai
          .request(server)
          .delete("/api/threads/Furkan3")
          .send({ thread_id: "5d11cae18e7256265c98b2e3" })
          .end((err, res) => {
            assert.equal(res.status, 500);
            assert.notEqual(res.body, "Delete successfull");
            done();
          });
      });
    });
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {
      test("POST A REPLY TO THREAD WITH ALL REQUIRED FIELDS", done => {
        chai
          .request(server)
          .post("/api/replies/Furkan3")
          .send({
            thread_id: "5d10ff252ec6342238903b1f",
            delete_password: "1234",
            text: "yeni bir reply"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
      test("POST A REPLY TO THREAD WITH SOME REQUIRED FIELDS", done => {
        chai
          .request(server)
          .post("/api/replies/Furkan3")
          .send({
            thread_id: "5d10ff252ec6342238903b1f"
          })
          .end((err, res) => {
            assert.equal(res.status, 500);
            done();
          });
      });
    });

    suite("GET", function() {
      test("GETTING ENTIRE THREAD WORKS", done => {
        chai
          .request(server)
          .get("/api/replies/Furkan3")
          .query({ thread_id: "5d10ff252ec6342238903b1f" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.message, "Yep we got the threads");
            done();
          });
      });
    });

    suite("PUT", function() {
      test("UPDATING REPLY WORKS", done => {
        chai
          .request(server)
          .put("/api/replies/Furkan3")
          .send({
            reply_id: "5d11c90599fff71ad80d8d90",
            thread_id: "5d10ff252ec6342238903b1f"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("SET TEXT [DELETED] WORKS", done => {
        chai
          .request(server)
          .delete("/api/replies/Furkan3")
          .send({
            reply_id: "5d11c90599fff71ad80d8d90",
            thread_id: "5d10ff252ec6342238903b1f",
            delete_password: "1234"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });
  });
});
