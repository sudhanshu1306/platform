function auth(req, res, next){
    if(!req.isAuthenticated()){
        return res.send('Not logined');
    }
    return next();
}

module.exports = auth