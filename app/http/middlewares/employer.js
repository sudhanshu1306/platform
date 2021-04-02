function employer(req, res, next){
    if(!req.isAuthenticated()){
        return res.send('Not logined');
    }
    if(req.user.type != 1){
        return res.send('Account is not a type of employer');
    }
    return next();
}

module.exports = employer