var express = require('express');
var router = express.Router({mergeParams:true});
var passport = require('passport');
var User = require('../models/muser');
var Camp = require('../models/mcampground');
var Comment = require('../models/mcomment');
var fs = require('fs');
var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/user')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);        
  }
});

var upload = multer({ storage: storage });
//Root
router.get('/',function(req,res){
	res.render("landing")
});

router.get('/about',function(req,res){
	res.render("about");
});

router.get('/contactus',function(req,res){
	res.render("contactus");
});

//Show Register Form	
router.get('/register',function(req,res){
	res.render('register');
});

//Signup logic
router.post('/register',function(req,res){
	var newUser = new User({username:req.body.username,firstname:req.body.firstname,lastname:req.body.lastname,email:req.body.email,userimg:"A"});
	User.register(newUser,req.body.password,function(err,user){
		if(!err){
			passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to Locate Places "+user.username);
			res.redirect("/places");
		});
		}else{
			req.flash("error",err.message);
			res.redirect('/register');
		}
	});	
});

router.get('/user', isLoggedIn, function(req,res){
	User.find({'username':req.user.username}).exec(function(err,users){
		Camp.find({'author.username':req.user.username}).exec(function(err,campusers){
			Comment.find({'author.username':req.user.username}).exec(function(err,comusers){
				res.render('profile',{users:users,campusers:campusers,comusers:comusers});
			});
		});
	});
});

router.post('/users/newprofile',upload.single('file-upload'),function(req,res){
	var img = {
		data : req.file.originalname,
		contentType : 'image/png'
	};
	console.log(img);
	User.findByIdAndUpdate(req.user._id,{userimg:img},function(err){
		if(!err){
			req.flash("success","Photo Uploaded Successfully");
			res.redirect("/user");
		}
	});
});

//login form
router.get('/login',function(req,res){
	res.render("login");
});

router.get('/loginfailed',function(req,res){
	req.flash("error","Sorry, Wrong Username or Password");
	res.redirect("/login");
})

//handles login logic
router.post('/login',passport.authenticate('local',{
	successRedirect:'/places',
	failureRedirect:'/loginfailed'
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