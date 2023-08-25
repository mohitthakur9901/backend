const localStrategy = require('passport-local').Strategy;
const {User} = require('./database.js');
exports.initializePassport = (passport) =>{

    passport.use(new localStrategy( async (username,password,done) =>{
        try{
            const user = await User.findOne({username:username});
            if(!user) return done(null,false);
            if(user.password !== password) return done(null,false);
            return done(null,user);
    
        }
        catch(err){
            return done(err,false);
        }
    }));

    passport.serializeUser((user,done) =>{
        done(null,user._id);
    })
    passport.deserializeUser(async (id,done) =>{
        try{
            const user = await User.findById(id);
            done(null,user);
        }
        catch(err){
            done(err,null);
        }
    });
};

exports.isAuthenticated = (req, res, next) => {
    if (req.user) {
       
        return next();
    } else {
        res.redirect('/login');
    }
};

