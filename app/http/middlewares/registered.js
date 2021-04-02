const Course = require('../../model/course')

function registered(req, res, next){
    
    if(req.user.type != 0){
        try {
            Course.findById(req.body.idCourse,function(err,doc){
                if(err){
                   return res.send("Some Error occured");
                }
                else if(doc.registered.indexOf(req.user._id) == -1){
                        return res.send("Not Registered for this course")
                    }
                    else{
                        return next();
                    }
                
            })
        } catch (error) {
            return res.send("Some Error occured");
        }
        
    }
    else{
        return next();
    }
    
}

module.exports = registered