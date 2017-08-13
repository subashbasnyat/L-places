var express = require('express');
var router = express.Router({mergeParams:true});
var Camp = require('../models/mcampground');
var Comment = require('../models/mcomment');


//Comments New
router.get("/new",isLoggedIn,function(req,res){
	// Camp.findById(req.params.id,function(err,campground){
	Camp.findById(req.params.id).populate('comments').exec(function(err,camps){
		var already=0;
		camps.comments.forEach(function(comments){
			if (comments.author.id.equals(req.user._id)){
				already++;
				console.log("Already");
			}
		});
		if(already<1){
			res.render("comments/new",{campground:camps});
		}else{
			req.flash("error","You have already commented on this article.")
			res.redirect("/places/"+camps._id);
		}
	});
});


//Comments create
router.post("/",isLoggedIn,function(req,res){
	//lookup campground using ID
	Camp.findById(req.params.id,function(err,campground){
		if(!err){
			Comment.create(req.body.comment,function(err,comment){
				if(!err){
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.campground.id=campground.id;
					comment.campground.campname= campground.name;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/places/"+campground._id);
				}
			});
		}else{
			res.redirect("/places");
		}
	});
});

router.get("/:cid/edit",isOwner,function(req,res){
	var campground= req.params.id;
	Comment.findById(req.params.cid,function(err,comment){
		res.render('../views/comments/edit',{campground:campground,comment:comment});
	});
});


router.put("/:cid",isOwner,function(req,res){
	Comment.findByIdAndUpdate(req.params.cid,req.body.comment,function(err,comment){
		if(!err){
			res.redirect("/places/"+req.params.id);
		}
	});
});

router.delete("/:cid",isOwner,function(req,res){
	Comment.findByIdAndRemove(req.params.cid,function(err){
		if(!err){
			req.flash("success","Comment Deleted");
			res.redirect("/places/"+req.params.id);
		}
	});
});

//MiddleWare
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Pleash Login");
	res.redirect('/login');
}

function isOwner(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.cid,function(err,comment){
			if(comment.author.id.equals(req.user._id)){
				next();
			}else{
				req.flash("error","You are not allowed");
				res.redirect("/places/"+req.params.id);
			}
		});
	}else{
		req.flash("error","Please Login");
		res.redirect("/login");
	}
}

module.exports = router;
