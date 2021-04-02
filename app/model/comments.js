const mongoose = require('mongoose');
const User = require('./user');
const Commentreply = require('./commentReply');

const commentSchema = mongoose.Schema({
    author : {type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
       },
    content : String,
    reply : [{
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'Commentreply'
  }],
  likes : [{
    type :  mongoose.Schema.Types.ObjectId,
    ref : 'User'
}]
})
const Comment = mongoose.model('Comment',commentSchema);
module.exports = Comment;