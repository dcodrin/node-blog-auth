var mongoose = require('mongoose'),
    mongodb = require('mongodb');

var mongoConnection = mongoose.connect('mongodb://localhost/nodeauth');
var db = mongoose.connection;

module.exports = mongoConnection;