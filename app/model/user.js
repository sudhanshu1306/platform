const mongoose = require('mongoose');
const Job = require('./job');
const Article = require('./article');
const Course = require('./course');
const Question = require('./question');

const userSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String,
    info : String,
    jobs : [{
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'Job'
  }],
  profileImage:String,
  type : {type : Number},
  articles : [{
    type :  mongoose.Schema.Types.ObjectId,
    ref : 'Article'
}],
    courses : [{
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'Course'
    }],
    questions : [{
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'Question'
    }]
})
module.exports = mongoose.model('User',userSchema);