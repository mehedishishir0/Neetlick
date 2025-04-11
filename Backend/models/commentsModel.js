const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    text: {
        type: String,
        required: true,
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },

})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment;