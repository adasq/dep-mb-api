var db = require('../db/connect'),
Utils = require('./Utils'),
Session = require('./Session'),
_ = require('underscore'),
q = require('q');




var User = function(data){
	this.data = data;
	if(!data._id){
		this.data.pass = Utils.getHashByPassword(this.data.pass);	
	}
};
 

User.getUserByField = function(field, value){
	var deferred = q.defer();
	var options = {};
	options[field]= value;
db.User.findOne(options, function (err, person) {
  	if(err){
			deferred.reject();
		}else{
			deferred.resolve((person?(new User(person)):null));
		}
});
return deferred.promise;	
};

User.getUserByName = function(name){
 	return User.getUserByField("name", name);
};

User.getUserById = function(id){
	return User.getUserByField("_id", id);
};

User.prototype.toString = function(argument) {
	return "";
};

User.prototype.isPasswordCorrect = function(plain) {
	return (this.data.pass === Utils.getHashByPassword(plain));
};

User.prototype.getSessionByUserAgent = function(ua) {
	return _.find(this.data.sessions, function(session){
			return (Utils.getHashByPassword(ua) === session.userAgent);
	});
};

User.prototype.createSession = function(ua) {
	var that = this;
	var session = new Session({userAgent: Utils.getHashByPassword(ua), accessToken: Utils.getUUID()});
   	session.save().then(function(session){
console.log(session);
   	});
	

};

User.prototype.save = function() {	
	var that=this, deferred = q.defer();
	if(this.data._id){
		//update
		this.data.save(function(err, model){			
			if(err){			
					deferred.reject();
			}else{
				that.data = model;
				deferred.resolve(model);
			}
		});
	}else{
		//create
		var user = new db.User(this.data);
		user.save(function(err, model){
		if(err){
			deferred.reject(err);
		}else{
			deferred.resolve(model);
		}
		});
	}
	
	return deferred.promise;	
};


 


module.exports = User;