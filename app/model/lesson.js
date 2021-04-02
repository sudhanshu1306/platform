const Video = require('./video');
const Course = require('./course');
const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
    title : String,
    course : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'Course'
    },
    videos : [{
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'Video'
  }]
})
module.exports = mongoose.model('Lesson',lessonSchema);