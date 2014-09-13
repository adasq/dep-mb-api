

var request = require('request');
var q = require('q');
var Response = require('./Response'); 


module.exports = function(){
	var j= request.jar();
	this.jar =j;
	this.send = function(url){
			var defer= q.defer(); 			
			request({uri: url, jar: j, followRedirect: false}, function(e,r,b){
				var response = new Response(r);
				defer.resolve(response);
			});
			return defer.promise;
	};
	this.get = function(url){
			var defer= q.defer(); 	
			request({uri: url, jar: j, followRedirect: true}, function(e,r,b){				
				defer.resolve(b);
			});
			return defer.promise;
	};
	this.post = function(url, data){
			var defer= q.defer(); 			
			request.post({form: data, uri: url, jar: j, followRedirect: false}, function(e,r,b){		 
				var response = new Response(r);
				defer.resolve(response);
			});
			return defer.promise;
	};
};