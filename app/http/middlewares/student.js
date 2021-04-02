function student(req, res, next){
    if(!req.isAuthenticated()){
        return res.send('Not logined');
    }
    if(req.user.type != 2){
        return res.send('Account is not a type of student');
    }
    return next();
}

module.exports = student