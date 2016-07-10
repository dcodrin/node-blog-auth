var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user');

// handle file uploads
var upload = multer({dest: './uploads'});

// serialize
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

// passport strategy
passport.use(new LocalStrategy(function (username, password, done) {
    console.log(username, password);
    User.getUserByUsername(username, function (err, user) {
        if (err) {
            done(err);
        }
        if (!user) {
            return done(null, false, {message: 'Unknown user'});
        }

        User.comparePassword(password, user.password, function (err, isMatch) {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid password'});
            }
        });
    });
}));

/* GET users */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/register', function (req, res, next) {
    res.render('register', {title: 'Register'});
});

router.get('/login', function (req, res, next) {
    res.render('login', {title: 'Login'});
});

router.get('/logout', function(req, res, next) {
    req.logout();
    req.flash('success', 'You are now logged out.');
    res.redirect('/users/login');
});

/* POST users */

router.post('/register', upload.single('profile_image'), function (req, res, next) {
    var {name, email, password, username, confirm_password} = req.body;
    var profileImage = req.file ? req.file.filename : 'noimage.jpg';


    // validate form fields

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email must be valid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('confirm_password', 'Passwords must match').equals(password);

    // check errors

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors
        });
        console.log(errors, 'Errors where found');
    } else {
        var newUser = new User.User({
            name,
            email,
            username,
            password,
            profileImage
        });

        User.createUser(newUser, function (err, user) {
            if (err) {
                var errors = Object.keys(err.errors).map(function (err) {
                    if (err === 'username') {
                        return {msg: 'Username is taken please choose another one.'};
                    } else {
                        return {msg: 'Email is already in our database. Please sign in or choose another email to register.'};
                    }
                });
                res.render('register', {errors});
            } else {
                req.flash('success', 'You are now registered! Please login to post and view content.');
                res.redirect('/');
            }
        });
    }

});

router.post('/login',
    passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid username or password.'}),
    function (req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.

        req.flash('success', 'You are now logged in');
        res.redirect('/');
    });


module.exports = router;
