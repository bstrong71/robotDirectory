const express = require('express');
const router  = express.Router();
const Data    = require('../models/robotDirectory.json');

router.get('/', function (req, res) {
  res.render('index', { userList: Data.allUsers});
});

router.get('/user/:id', function (req, res) {
  let id = req.params.id;

  let userP = Data.allUsers.find(function(user) {
    return user.id == id; //return any user that equals the user.id//
  });                      //.find requires two equals//
  res.render('profile', userP);
});

module.exports = router;
