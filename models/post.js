var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// user schema

var PostSchema = Schema({
    title: {
        type: String,
        index: true
    },
    author: {
        type: String
    },
    body: {
        type: String
    },
    date: {
        type: Date
    },
    mainImage: {
        type: String
    },
    categories: Array
});

var Post = mongoose.model('Post', PostSchema);

function createPost(newPost, callback) {
    newPost.save(callback);
}

function getPostById(postId, callback) {
    Post.findById(postId, callback);
}

function getPostByTitle(title, callback) {
    Post.findOne({title}, callback);
}


module.exports = {
    Post,
    createPost,
    getPostById,
    getPostByTitle
};