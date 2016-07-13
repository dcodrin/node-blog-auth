var express = require('express'),
    router = express.Router(),
    Post = require('../models/post');
var db = require('../db/mongodb.js');

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  Post.Post.find({}, function(err, posts){
    console.log(posts);
    if(err) {
      console.log(err);
    } else {
      res.render('index', {title: 'All Posts', posts: posts});
    }
  });
});

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
