var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var flash = require('connect-flash');
mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://localhost/campdb");
mongoose.connect("mongodb://subashbasnyat:subashbasnet0123@ds155841.mlab.com:55841/lplaces");

var seedDB = require("./seeds");

//seedDB();

var Comment = require("./models/mcomment");
var Camp = require("./models/mcampground");
var User = require("./models/muser");


var commentRoutes = require("./routes/rcomments"),
	campgroundRoutes = require('./routes/rcampgrounds'),
	indexRoutes = require('./routes/rindex')


app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());

//Passport Configuration
app.use(require('express-session')({
	secret:"Fredrich Nietzsche",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
//=============================
//Campground Routes
//=============================

//=========================================
//Comments Router
//=========================================

//=============================
//AUTH ROUTES
//=============================

app.listen(process.env.PORT,process.env.IP,function(){
	console.log("GOOD to GO");
});