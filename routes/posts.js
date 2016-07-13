var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    Category = require('../models/category'),
    Post = require('../models/post');


var db = require('../db/mongodb.js');

// handle file uploads
var upload = multer({dest: './public/postUploads'});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
}

/* GET POSTS */
router.get('/add', ensureAuthenticated, function (req, res, next) {

    Category.Category.find({}, function (err, categories) {
        var categoryNames = categories.map(function (cat) {
            return cat.title;
        });
        res.render('addpost', {title: 'Add Post', categories: categoryNames});
    });
});

router.get('/show/:id', ensureAuthenticated, function (req, res, next) {
    Post.Post.findById(req.params.id, function (err, post) {
        if(err) {
            console.log(err);
        } else {
            res.render('showpost', {title: post.title, post});
        }
    });
});

/* POST POSTS */
router.post('/add', ensureAuthenticated, upload.single('main_image'), function (req, res, next) {
    var {title, category, body, author} = req.body;
    var date = new Date();
    var mainImage = req.file ? req.file.filename : 'noimage.jpg';

    // form validation
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Post can\'t be blank').notEmpty();

    // check errors
    var errors = req.validationErrors();

    if (errors) {
        res.render('addpost', {errors});
    } else {
        var newPost = new Post.Post({
            title,
            body,
            date,
            author,
            category,
            mainImage
        });
        Post.createPost(newPost, function (err, post) {

            if (err) {
                console.log(err);
            } else {
                post.categories.push(category);
                post.save(function (err, post) {
                    console.log(post);
                    req.flash('success', 'Post added.');
                    res.redirect('/');
                });
            }
        });
    }
});

module.exports = router;
