const mongoose = require('mongoose');
const User = require('./user');

const commentReplySchema = mongoose.Schema({
    author : {type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
       },
    content : String
})
module.exports = mongoose.model('Commentreply',commentReplySchema);