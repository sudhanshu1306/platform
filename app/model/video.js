const Lesson = require('./lesson');
const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    title : String,
    content : String,
    approved : {type : Number, default : 0},
    lesson : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'Lesson'
  },
  path : String
})
module.exports = mongoose.model('Video',videoSchema);