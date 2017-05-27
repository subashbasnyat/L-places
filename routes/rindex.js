var express = require('express');
var router = express.Router({mergeParams:true});
var passport = require('passport');
var User = require('../models/muser');

//Root
router.get('/',function(req,res){
	res.render("landing")
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
			res.redirect("/campgrounds");
		});
		}else{
			req.flash("error",err.message);
			res.redirect('/register');
		}
	});	
});

//login form
router.get('/login',function(req,res){
	res.render("login");
});

//handles login logic
router.post('/login',passport.authenticate('local',{
	successRedirect:'/campgrounds',
	failureRedirect:'/login'
}),function(req,res){
});

//logout
router.get('/logout',function(req,res){
	req.logout();
	req.flash("success","Logged Out");
	res.redirect('/campgrounds');
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