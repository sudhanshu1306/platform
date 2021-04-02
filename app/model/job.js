const mongoose = require('mongoose');
const User = require('./user');

const jobSchema = mongoose.Schema({
    title : String,
    info : String,
    approved : {type : Number, default : 0},
    employer : {type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
       },
       applied : [{
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'User'
  }]
})
module.exports = mongoose.model('Job',jobSchema);