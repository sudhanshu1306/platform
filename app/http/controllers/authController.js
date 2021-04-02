const bcrypt = require('bcryptjs');
const User = require('../../model/user');
const passport = require('passport');
const mongoose = require('mongoose');
function authController(){
    return {

        postLogin(req, res, next){
            // here err, user, info is coming from passport.js where in done() function we have provided null, false/user , message
            passport.authenticate('local-user', (err, user, info)=>{
                if(err){
                    req.flash('error', info.message);
                    return next(err);
                }
                else if(!user){
                    req.flash('error', info.message);
                    return res.status(500).json({
                        message: 'No user exists'
                    });
                }
                else{
                req.logIn(user, (err)=>{
                    if(err){
                        req.flash('error', info.message);
                        return next(err);
                    }else if(user.type == 0){
                   /* return res.status(200).json({
                        message: 'Successfully logined',
                        admin: user
                    })*/
                    res.redirect('..');
                }
                else if(user.type == 1){
                   /* return res.status(200).json({
                        message: 'Successfully logined',
                        employer: user
                    })*/
                    res.redirect('..');
                }
                else if(user.type == 2){
                   /* return res.status(200).json({
                        message: 'Successfully logined',
                        student: user
                    })*/
                    res.redirect('..');
                }
                else if(user.type == 3){
                   /* return res.status(200).json({
                        message: 'Successfully logined',
                        instructor: user
                    })*/
                    res.redirect('..');
                }
                })
            }
            })(req, res, next)
        },
        register(req, res){
            res.send("done");
        },


        async postRegister(req, res){
            const {name, email, password, info} = req.body;
             const type = Number(req.body.type);
            console.log(req.body);
            console.log(req.file);
            //Check if any field is empty
            if(!name || !email || !password || !info || req.body.type == ""){
                req.flash('error', 'All fields are required');
                req.flash('name', name);
                req.flash('email', email);
               return res.send("all fields are requireed");
            }
            //Check if user email already exists
            // Employer.exists({email: email}, (err, result)=>{
            //     if(result){
            //         req.flash('error', 'Email already exists, Try another!')
            //         req.flash('name', name);
            //         req.flash('email', email);
            //       res.redirect('/register');
            //     }
            // })
            const userx = await User.findOne({email: email});
            if(userx){
                return res.status(500).json({message: 'User already exists'});
            }
            //Hash Password
            const hashedPass = await bcrypt.hash(password, 10);

            //Create a user
            const user = new User({
                name: name,
                email: email,
                password: hashedPass,
                info : info,
                type : type
            })

            if(req.file){
                user.profileImage=req.file.path;
            }

            user.save().then(()=>{
               /* return res.status(200).json({
                    message: 'Successfully registered',
                    user: user
                })*/
                res.redirect('..');
            }).catch((err)=>{
                req.flash('error', 'Something went wrong');
                res.send("some error occured");
            })
        },
        logout(req, res){
            let up = req.user;
            req.logout();
           /* return res.status(200).json({
                message: 'Successfully logouted',
                account: up
            })*/
            res.redirect('./login');
        }
    }
}
module.exports = authController;
