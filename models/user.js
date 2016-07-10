var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs');


mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

// user schema

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true
    },
    name: {
        type: String
    },
    profileImage: {
        type: String
    }
});

UserSchema.plugin(uniqueValidator, {message: 'Expected {PATH} to be unique.'});

var User = mongoose.model('User', UserSchema);

UserSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

function createUser(newUser, callback) {
    newUser.save(callback);
}

function getUserById(userId, callback) {
    User.findById(userId, callback);
}

function getUserByUsername(username, callback) {
    User.findOne({username}, callback);
}

function comparePassword(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        callback(null, isMatch);
    });
}

module.exports = {
    User,
    createUser,
    getUserById,
    getUserByUsername,
    comparePassword
};