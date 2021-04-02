function notStudent(req, res, next){
    if(!req.isAuthenticated()){
        return res.send('Not logined');
    }
    if(req.user.type == 2){
        return res.send('Not Authorised account is of student type');
    }
    return next();
}

module.exports = notStudent