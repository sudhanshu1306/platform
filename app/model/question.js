const mongoose = require('mongoose');
const User = require('./user');
const Answer = require('./answer');

const questionSchema = mongoose.Schema({
    title : String,
    content : String,
    author : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'User'
  },
   answers : [{
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'Answer'
  }],
    likes : [{
    type :  mongoose.Schema.Types.ObjectId,
    ref : 'User'
}],
pics : [String],
tags : [String]
});

module.exports = mongoose.model('Question',questionSchema);