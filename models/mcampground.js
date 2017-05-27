var mongoose=require('mongoose');
var campSchema = new mongoose.Schema({
	name: String,
	image: String,
	details: String,
	author: {
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	},
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"comment"
		}
	]
});

module.exports = mongoose.model("campground",campSchema);