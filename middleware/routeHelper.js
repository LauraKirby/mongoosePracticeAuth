//refactor 
//pass in a model as a parameter 

var db = require('../models'); 

var routeHelpers = {
	ensureLoggedIn: function(req, res, next){
		if(req.session.id !== null && req.session.id !== undefined) {
			return next(); 
		}
		else{
			res.redirect('/login'); 
		}
	},

	ensureCorrectUser: function(req,res,next) {
		db.User.findById(req.params.id, function(err, user){
			if (user.ownerId !== req.session.id) {
				res.redirect('/countries'); 
			}
			else {
				return next(); 
			}
		});
	},

	preventLoginSignup: function(req,res,next){
		if(req.session.id !== null && req.session.id !== undefined){
			res.redirect('/countries');
		}
		else {
			return next(); 
		}
	}
};

module.exports = routeHelpers; 

//this is an object so we will use it with dot notation