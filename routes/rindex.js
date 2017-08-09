var express = require('express');
var router = express.Router({mergeParams:true});
var passport = require('passport');
var User = require('../models/muser');
var Camp = require('../models/mcampground')

//Root
router.get('/',function(req,res){
	res.render("landing")
});

router.get('/about',function(req,res){
	res.render("about");
});

//Show Register Form	
router.get('/register',function(req,res){
	res.render('register');
})

//Signup logic
router.post('/register',function(req,res){
	var newUser = new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(!err){
			passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to YelpCamp "+user.username);
			res.redirect("/places");
		});
		}else{
			req.flash("error",err.message);
			res.redirect('/register');
		}
	});	
});

router.get('/user', function(req,res){
	Camp.find({'author.username':req.user.username}).exec(function(err,users){
		res.render('profile',{users:users});
	});
});

//login form
router.get('/login',function(req,res){
	res.render("login");
});

router.get('/loginfailed',function(req,res){
 req.flash("error","SORRY MOFO");
 res.redirect("/login");
})

//handles login logic
router.post('/login',passport.authenticate('local',{
	successRedirect:'/places',
	failureRedirect:'/loginfailed',
	failureRedirect:'/login'
}),function(req,res){
});

//logout
router.get('/logout',function(req,res){
	req.logout();
	req.flash("success","Logged Out");
	res.redirect('/places');
});

//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please Login");
	res.redirect('/login');
}
module.exports = router;