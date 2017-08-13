var express = require('express');
var router = express.Router();
var Camp = require('../models/mcampground');
var fs = require('fs');
var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);        
  }
})
 
var upload = multer({ storage: storage })
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


// var newItem = new Item();
//  newItem.img.data = fs.readFileSync(req.files.userPhoto.path)
//  newItem.img.contentType = ‘image/png’;
//  newItem.save();


//create
router.post("/",upload.single('file'),isLoggedIn,function(req,res){
	var name = req.body.placename;
	var details = req.body.details;
	var img = {
		data : req.file.originalname,
		contentType : 'image/png'
	}
	var author = {
		id: req.user._id,
		username:req.user.username
	}
	var latitude = req.body.latitude;
	var longitude = req.body.longitude;
	console.log(req.body);
	Camp.create({
		name:name,
		details:details,
		img:img,
		author:author,
		latitude:latitude,
		longitude:longitude,
		views:0
	},function(err,camp){
		if(!err){
			res.redirect("/places");
		}
	});
});

//show details
router.get("/:id",function(req,res){
	Camp.find(function(err,allcamps){
		Camp.findById(req.params.id).populate('comments').exec(function(err,camps){
			camps.views = camps.views+1;
			camps.save(function(err,dcamp){
				if(!err){
					res.render("campgrounds/details",{detail:dcamp,allcamps:allcamps});
				}
			})
			if(!err){
				console.log("GOOD EVERYTHING IS GOOD");
			}
		});
	})
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
			res.redirect("/places/"+req.params.id);
		}
	});
});

router.delete("/:id",isCampOwner,function(req,res){
	Camp.findByIdAndRemove(req.params.id,function(err){
		if(!err){
			res.redirect("/places");
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
					res.redirect('/places/'+camp.id);
				}
			}
		});
	} else{
		req.flash("error","You need to be logged in");
		res.redirect('/login');
	}
}

module.exports  =router;