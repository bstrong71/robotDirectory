const express   = require('express');
const User      = require('../models/user');
const router    = express.Router();
const mongoose  = require('mongoose');
const passport  = require('passport');

mongoose.connect('mongodb://localhost:27017/users');

let data = []; //gives access to data in routes because global

//requires login to access user profile page//
const requireLogin = function (req, res, next) {
  if (req.user) {
    console.log(req.user)
    next()
  } else {
    res.redirect('/');
  }
};

const login = function (req, res, next) {
  if (req.user) {
    res.redirect("/user")
  } else {
    next();
  }
};

// retrieves all data for query access //
const getListings = function(req, res, next) {
  User.find({}).sort("name")
    .then(function(users) {
      data = users;
      next();
    })
    .catch(function(err) {
      console.log(err);
    })
};

//**** looking data middleware ****//
const getJobless = function(req, res, next) {
  User.find({"job": null}).sort("name")
    .then(function(users) {
      data = users;
      next();
    })
    .catch(function(err) {
      console.log(err);
    })
};

//**** employed data middleware ****//
const getEmployed = function(req, res, next) {
  User.find({"job": {$nin: [null]}}).sort("name")
    .then(function(users) {
      data = users;
      next();
    })
    .catch(function(err) {
      console.log(err);
    })
};

router.get('/', getListings, function(req, res) {
  res.render('listings', {users: data});
});

router.get('/login', function(req, res) {
  res.render('login');
})

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

router.get("/user", requireLogin, function(req, res) {
  res.render("user", {username: req.user.username});
});

router.get("/logout", function(req, res) {
  req.session.destroy(function(err) {
    console.log(err);
  });
  res.redirect("/");
});

module.exports = router;
