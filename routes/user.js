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
    res.redirect('/login');
  }
};

const login = function (req, res, next) {
  if (req.user) {
    res.redirect("/")
  } else {
    next();
  }
};

//***require login at directory page***//
router.get('/', requireLogin, function(req, res) {
  User.find({}).sort("name")
    .then(function(users) {
      let loggedIn = req.user;
      data = users;
      res.render('listings', {users: data, loggedIn: loggedIn});
    })
    .catch(function(err) {
      console.log(err);
    })
});

router.get('/login', login, function(req, res) {
  res.render('login', {
    messages: res.locals.getMessages()
  });
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get("/signup", function(req, res) {
  res.render("signup");
});

router.post("/signup", function(req, res) {
  User.create({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    university: req.body.university,
    job: req.body.job,
    company: req.body.company,
    skills: req.body.skills,
    phone: req.body.phone,
    address: {
      street_num: req.body.street_num,
      street_name: req.body.street_name,
      city: req.body.city,
      state_or_province: req.body.state_or_province,
      postal_code: req.body.postal_code,
      country: req.body.country
    }
  }).then(function(data) {
    console.log(data);
    res.redirect("/");
  })
  .catch(function(err) {
    console.log(err);
    res.redirect("/signup");
  });
});

//***require login in order to view looking section***//
router.get('/looking', requireLogin, function(req, res) {
  User.find({"job": null}).sort("name")
    .then(function(users) {
      data = users;
      res.render('looking', {users: data});
    })
    .catch(function(err) {
      console.log(err);
    })
});

//***require login in order to view employed section***//
router.get('/employed', requireLogin, function(req, res) {
  User.find({"job": {$nin: [null]}}).sort("name")
    .then(function(users) {
      data = users;
      res.render('employed', {users: data});
    })
    .catch(function(err) {
      console.log(err);
    })
});

//***View User Profile Page***//
router.get('/user/:id', function (req, res) {
  let id = req.params.id;
  if(req.user.id === id) {
    let userP = data.find(function(user) {
      return user.id == id;
    });
    res.render('editProfile', {userP: userP});
  } else {
    let userP = data.find(function(user) {
      return user.id == id;
    });
    res.render('profile', userP);
  }
});

// router.get('/editprofile/:id', function(req, res) {
//   let id = req.params.id;
//   let userP = data.find(function(user) {
//     return user.id == id;
//   });
//   res.render('editProfile', {userP);
// })

router.post('/update/:id', function(req, res) {
  let id = req.params.id;
  console.log("This is ID: ",id);
  let robotUpdate = {};
  if(req.body.name){
    robotUpdate.name = req.body.name;
  };
  if(req.body.email){
    robotUpdate.email = req.body.email;
  };
  if(req.body.university){
    robotUpdate.university = req.body.university;
  };
  if(req.body.job){
    robotUpdate.job = req.body.job;
  };
  if(req.body.company){
    robotUpdate.company = req.body.company;
  };
  if(req.body.skills){
    robotUpdate.skills = req.body.skills;
  };
  if(req.body.phone){
    robotUpdate.phone = req.body.phone;
  };
  if(req.body.street_num){
    robotUpdate.street_num = {"address": req.body.street_num};
  };
  if(req.body.street_name){
    robotUpdate.street_name = {"address": req.body.street_name};
  };
  if(req.body.city){
    robotUpdate.city = {"address": req.body.city};
  };
  if(req.body.state_or_province){
    robotUpdate.state_or_province = {"address": req.body.state_or_province};
  };
  if(req.body.postal_code){
    robotUpdate.postal_code = {"address": req.body.postal_code};
  };
  if(req.body.country){
    robotUpdate.country = {"address": req.body.country};
  };
  User.update({_id: id}, {$set: robotUpdate})
    .then(function(data) {
    res.redirect("/user/" + id);
    })
    .catch(function(err) {
      console.log(err);
  })
})

router.get("/logout", function(req, res) {
  req.session.destroy(function(err) {
    console.log(err);
  });
  res.redirect("/");
});



module.exports = router;
