function admin(req, res, next){
    if(!req.isAuthenticated()){
        return res.send('Not logined');
    }
    if(req.user.type != 0){
        return res.send('Not Authorised');
    }
    return next();
}

module.exports = admin