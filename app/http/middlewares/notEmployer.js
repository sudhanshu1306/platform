function notEmployer(req, res, next){
    if(!req.isAuthenticated()){
        return res.send('Not logined');
    }
    if(req.user.type == 1){
        return res.send('Not Authorised , account is of Employer type');
    }
    return next();
}

module.exports = notEmployer