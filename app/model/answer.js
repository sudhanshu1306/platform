const mongoose = require('mongoose');
const User = require('./user');
const Question = require('./question');

const answerSchema=new mongoose.Schema({
  question:{type:mongoose.Schema.Types.ObjectId,ref:'Question'},
  author:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  content:String,
  likes : [{
    type :  mongoose.Schema.Types.ObjectId,
    ref : 'User'
}],
reply : [{
    type :  mongoose.Schema.Types.ObjectId,
    ref : 'Commentreply'
}],
  pics:[String]
});
module.exports = mongoose.model('Answer',answerSchema);
