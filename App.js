const express = require('express');
const {connectMongoose, User} = require("./database.js")
const ejs = require('ejs');
const passport = require('passport');
const { initializePassport , isAuthenticated } = require('./passPortconfig.js');
const expressSession = require('express-session');


const app = express();

//database connection
connectMongoose();
initializePassport(passport);


app.set('view engine', 'ejs');
app.use(expressSession({secret: 'secret', resave: false, saveUninitialized: false}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());

//read Api
app.get("/register", (req, res) => {
    res.render('register');
})

app.get("/login", (req, res) => {
    res.render('login');
})
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/profile',isAuthenticated, (req, res) => {
    res.send(req.user);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.send("Logged out");
});


//Post Api
app.post('/register',async (req, res) => {
    let user = await User.findOne({username:req.body.username});
    if(user) return res.status(400).send("User already registered");
    const newUser = await User.create(req.body);
    res.status(201).send(newUser);
});

app.post('/login',passport.authenticate('local',{failureRedirect:'/login',successRedirect:"/"}
    ),(req, res) => {
        res.redirect('/');
    });



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});