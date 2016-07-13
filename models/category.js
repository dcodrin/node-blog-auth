var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// user schema

var CategorySchema = Schema({
    title: {
        type: String,
        index: true,
        unique: true,
        uniqueCaseInsensitive: true
    }
});

var Category = mongoose.model('Category', CategorySchema);

function createCategory(newCategory, callback) {
    newCategory.save(callback);
}


module.exports = {
    Category,
    createCategory
};