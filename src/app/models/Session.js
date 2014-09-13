var db = require('../db/connect'),
Utils = require('./Utils'),
_ = require('underscore'),
q = require('q');


var Session = function(data){
	this.data = data;
};
 
Session.prototype.save = function() {	
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
		console.log(this.data);
		var session = new db.Session(this.data);
		session.save(function(err, model){
		if(err){
			deferred.reject();
		}else{
			that.data = model;
			deferred.resolve(model);
		}
		});
	}
	
	return deferred.promise;	
};


 


module.exports = Session;