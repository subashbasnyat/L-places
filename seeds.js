var mongoose = require('mongoose');
var Camp = require("./models/mcampground");
var Comment = require("./models/mcomment")

var data=[
	{
		name:"Nagarkot",
		image:"https://cache-graphicslib.viator.com/graphicslib/thumbs360x240/8066/SITours/nagarkot-guided-day-trek-from-kathmandu-in-kathmandu-228499.jpg",
		details:"It is beautiful. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident sunt culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name:"Kathmandu",
		image:"https://cache-graphicslib.viator.com/graphicslib/thumbs360x240/7649/SITours/kathmandu-full-day-tour-in-kathmandu-185414.jpg",
		details:"It is nice"	
	},
	{
		name:"Himalayas",
		image:"https://cache-graphicslib.viator.com/graphicslib/thumbs360x240/5588/SITours/flight-over-the-himalayas-including-mt-everest-from-kathmandu-in-kathmandu-170236.jpg",
		details:"It is mesmerizing"
	}
]
function seedDB(){
	//Remove all campgrounds
	Camp.remove({},function(err){
		if(!err){
			console.log("DELETED CAMPGROUNDS");
		}
	Comment.remove({},function(err){
		if(!err){
			console.log("DELETED COMMENTS");
		}
	//ADD A FEW CAMPGROUNDS
		// data.forEach(function(seed){
		// 	Camp.create(seed,function(err,campground){
		// 		if(!err){
		// 			console.log("added campgrounds");
		// 			//Comments
		// 			Comment.create({
		// 				text:"This is a beautiful place",
		// 				author:"Subash Basnet"
		// 			},function(err,comment){
		// 				if(!err){
		// 					campground.comments.push(comment);
		// 					campground.save();
		// 					console.log("Created New Comment");
		// 				}else{
		// 					console.log(err);
		// 				}
		// 			});

		// 		}else{
		// 			console.log(err);
		// 		}
		// 	});
		// });
	});});
}
module.exports = seedDB;