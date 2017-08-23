const express = require('express');
const router  = express.Router();

let data = []; //gives access to data in routes because global
// retrieves all data for query access //
const getListings = function(req, res, next) {
  let MongoClient = require("mongodb").MongoClient;
  let assert = require("assert"); //for testing//

  let url = "mongodb://localhost:27017/robotDirectory"; //url connects to mongo db

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err); //are there any errors?//

    getData(db, function() {
      db.close(); //closes db so doesn't keep running
      next();
    });
  });
  // this function will grab data from db when called //
  let getData = function(db, callback) {
    let users = db.collection("users"); //users now represents db//

    users.find({}).toArray().then(function(users) { //this line will be changed
      data = users; //not pushed, so not array in array//
      callback(); //run callback after getting data//
    })
  }
};

//**** looking data middleware ****//
const getJobless = function(req, res, next) {
  let MongoClient = require("mongodb").MongoClient;
  let assert = require("assert");
  let url = "mongodb://localhost:27017/robotDirectory";

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    getData(db, function() {
      db.close();
      next();
    });
  });

  let getData = function(db, callback) {
    let users = db.collection("users");

    users.find({"job": null}).toArray().then(function(users) {
      data = users;
      callback();
    })
  }
};

//**** employed data middleware ****//
  getEmployed = function(req, res, next) {
  let MongoClient = require("mongodb").MongoClient;
  let assert = require("assert");

  let url = "mongodb://localhost:27017/robotDirectory";

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    getData(db, function() {
      db.close();
      next();
    });
  });

  let getData = function(db, callback) {
    let users = db.collection("users");

    users.find({"job": {$nin: [null]}}).toArray().then(function(users) {
      data = users;
      callback();
    })
  }
};

router.get('/', getListings, function (req, res) {
  res.render('listings', {users: data});
});

router.get('/looking', getJobless, function(req, res) {
  res.render('looking', {users: data});
});

router.get('/employed', getEmployed, function(req, res) {
  res.render('employed', {users: data});
});

router.get('/user/:id', getListings, function (req, res) {
  let id = req.params.id;
//return any user that equals the user.id//
  let userP = data.find(function(user) {
    return user.id == id;
  });
  res.render('profile', userP);
});

module.exports = router;
