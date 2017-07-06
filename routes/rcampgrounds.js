var express = require('express');
var router = express.Router();
var Camp = require('../models/mcampground');

//Index
// router.get("/",function(req,res){
// 	Camp.find({},function(err,camps){
// 		if(!err){
// 			res.render("campgrounds/campgrounds",{camp:camps});
// 		}
// 	});
// });
router.get("/",function(req,res){
	Camp.find({}).sort({views:'descending'}).exec(function(err,docs){
		if(!err){
			res.render("campgrounds/campgrounds",{camp:docs});
		}
	})
});

//new
router.get("/new",isLoggedIn,function(req,res){
	res.render("campgrounds/newcamp");
});

//create
router.post("/",isLoggedIn,function(req,res){
	var name = req.body.placename;
	var image = req.body.imageurl;
	var details = req.body.details;
	var author = {
		id: req.user._id,
		username:req.user.username
	}
	Camp.create({
		name:name,
		image:image,
		details:details,
		author:author,
		views:0
	},function(err,camp){
		if(!err){
			res.redirect("/campgrounds");
		}
	});
});

//show details
router.get("/:id",function(req,res){
	Camp.findById(req.params.id).populate('comments').exec(function(err,camps){
		camps.views = camps.views+1;
		camps.save(function(err,dcamp){
			if(!err){
				res.render("campgrounds/details",{detail:dcamp});
			}
		})
		if(!err){
			console.log("GOOD EVERYTHING IS GOOD");
		}
	});
});

router.get('/:id/edit',isCampOwner,function(req,res){
	Camp.findById(req.params.id,function(err,camp){
		if(!err){
			res.render('campgrounds/edit',{camp:camp});
		}
	})
});


router.put("/:id",isCampOwner,function(req,res){
	Camp.findByIdAndUpdate(req.params.id,req.body.camp,function(err){
		if(!err){
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

router.delete("/:id",isCampOwner,function(req,res){
	Camp.findByIdAndRemove(req.params.id,function(err){
		if(!err){
			res.redirect("/campgrounds");
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in");
	res.redirect('/login');
}

function isCampOwner(req,res,next){
	if(req.isAuthenticated()){
		Camp.findById(req.params.id,function(err,camp){
			if(err){
				res.redirect('back');
			}else{
				if(req.user._id.equals(camp.author.id)){
					next();
				}else{
					req.flash("error","You are not allowed");
					res.redirect('/campgrounds/'+camp.id);
				}
			}
		});
	} else{
		req.flash("error","You need to be logged in");
		res.redirect('/login');
	}
}

module.exports  =router;