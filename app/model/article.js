const User = require('./user');
const Comment = require('./comments');
const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    title : String,
    content : String,
    author : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'User'
  },
   comments : [{
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'Comment'
  }],
  likes : [{
    type :  mongoose.Schema.Types.ObjectId,
    ref : 'User'
}] ,
approved : {type : Number, default : 0}
})
module.exports = mongoose.model('Article',articleSchema);