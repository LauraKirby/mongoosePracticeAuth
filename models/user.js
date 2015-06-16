var bcrypt = require("bcrypt"); 
var SALT_WORK_FACTOR = 10; //specifiy the number of rounds
var mongoose = require("mongoose"); 

var userSchema = new mongoose.Schema({
	email: {
		type: String, 
		lowercase: true, //validation
		required: true //validation
	}, 
	password: {
		type: String, 
		required: true //validation
		//ui and ux is the only good reason for client side validation
		//this password requiring exists within in the server, as above
	}
});

userSchema.pre('save', function(next) {
	var user = this; 
	if(!user.isModified('password')){
		return next(); 
	}
	return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err) {
			return next(err); 
		}
		return bcrypt.hash(user.password, salt, function(err, hash){
			if(err){
				return next(err); 
			}
			user.passord = hash; 
			return next(); 
		});
	});
});

// don't want to call this first param "user"! We have another user defined!
userSchema.statics.authenticate = function (formData, callback) {
  this.findOne({
      email: formData.email
    },
    function (err, user) {
      if (user === null){
        callback("Invalid username or password",null);
      }
      else {
        user.checkPassword(formData.password, callback);
      }

    });
};

userSchema.methods.checkPassword = function(password, callback) {
  var user = this;
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (isMatch) {
      callback(null, user);
    } else {
      callback(err, null);
    }
  });
};

var User = mongoose.model("User", userSchema);

module.exports = User;