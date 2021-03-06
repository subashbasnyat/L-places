var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose')

var userSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	username: String,
	email: String,
	password: String,
	userimg:  { 
		data: Buffer, contentType: String 
	}
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);