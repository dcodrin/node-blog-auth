var express = require('express'),
    router = express.Router(),
    Post = require('../models/post'),
    Category = require('../models/category');

var db = require('../db/mongodb.js');


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
}

/* GET CATEGORIES */
router.get('/add', ensureAuthenticated, function (req, res, next) {
    res.render('addcategory', {title: 'Add Category'});
});

router.get('/', ensureAuthenticated, function (req, res, next) {

    Category.Category.find({}, function (err, categories) {
        var categoryNames = categories.map(function (cat) {
            return cat.title;
        });
        res.render('showcategories', {title: 'All Categories', categories: categoryNames});
    });
});

router.get('/show/:category', ensureAuthenticated, function (req, res, next) {
    console.log(req.params);

    Post.Post.find({categories: {$in: [req.params.category]}}, function (err, posts) {
        res.render('index', {title: 'All Categories', posts: posts});
    });
});


/* POST CATEGORIES */
router.post('/add', ensureAuthenticated, function (req, res, next) {
    var title = req.body.category;
    req.checkBody('category', 'Category Name can\'t be blank').notEmpty();
    // check errors
    var errors = req.validationErrors();
    if (errors) {
        res.render('addcategory', {errors});
    } else {
        var newCategory = new Category.Category({
            title
        });

        Category.createCategory(newCategory, function (err, category) {
            if (err) {
                console.log(err.message);
                var errMsg = err.message;
                if(errMsg.indexOf('duplicate') > -1 ){
                    res.render('addcategory', {errors: [{msg: 'Duplicate category name.'}]});
                }
            } else {
                req.flash('success', 'Category added!');
                res.redirect('/categories');
            }
        });
    }
});

module.exports = router;
