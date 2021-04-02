const LocalStrategy = require('passport-local').Strategy
const User = require('../model/user');

const bcrypt = require('bcryptjs');


function passportInit(passport){
     
     // For Course Creator and Student login
     
     passport.use('local-user', new LocalStrategy({usernameField: 'email'}, async(email, password, done)=>{
        const user = await User.findOne({email: email});
        if(!user){
            return done(null, false, {message: 'No user with this email'});
        }
         bcrypt.compare(password, user.password).then((match)=>{
             if(match)
                 return done(null, user, {message: 'Logged in Successfulyy'});

             return done(null, false, {message: 'Username or password is incorrect'});
         }).catch((err)=>{
             return done(null, false, {message: 'Something went wrong'});
         })
      
      
   }));

    passport.serializeUser((userObject, done)=>{
        done(null, {id: userObject._id});   // second parameter to store in session to know whether user is logged in or not
    })
    
    passport.deserializeUser((obj, done)=>{
        
                User.findById(obj.id, (err, user)=>{
                    done(err, user);
                });

    });
    
}

module.exports = passportInit