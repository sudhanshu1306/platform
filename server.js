require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer =require('multer');

const session = require('express-session');
const flash = require('express-flash');
const MongoDBStore = require('connect-mongo')(session); // It will store our session id in database.
const passport = require('passport');

// const url = 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@cluster0.gcztl.mongodb.net/platform';
const url = 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@cluster0-gtoy8.mongodb.net/platform';
//const url = 'mongodb://localhost:27017/platform';
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true});
const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log('Database connected..');
}).catch(err =>{
    console.log('Connection failed..');
})

//Session Store
let mongoStore = new MongoDBStore({
    mongooseConnection: connection,
    collection: 'sessions'
});

app.set('view engine', 'ejs');

//Session Config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24}  // 24 hours
}));

//Passport config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(express.json());
app.use(express.static("public"));
app.use("/article",express.static("public"));
app.use("/question",express.static("public"));
app.use("/viewJob",express.static("public"));
app.use("/viewCourse",express.static("public"));


//Global Middleware to use session and user(if logged in) in client side
app.use((req, res, next)=>{
    res.locals.session = req.session;
    res.locals.user = req.user
    next();
});
app.use("/uploads",express.static("uploads"));
app.use("/question/uploads",express.static("uploads"));
app.use(express.urlencoded({extended: true}));
//set route
require('./routes/web.js')(app);

app.listen(process.env.PORT || 3000, ()=>{
    console.log('Listening on port 3000');
})
