const Lesson = require('./lesson');
const User = require('./user');
const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    title : String,
    info : String,
    author : {type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
       },
    registered : [{
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    lessons : [{
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'Lesson'
  }]
})
module.exports = mongoose.model('Course',courseSchema);