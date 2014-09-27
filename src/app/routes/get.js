var db = require('../db/connect');

var routes = [];

routes.push({
	url: "/xd",
	callback: function(req, res){
		  if(req.session.user){
      console.log("authorized: ",req.session.user);
    }
		res.send("ahaha");
	}
});

routes.push({
	url: "/topsecret",
	callback: (function(){
	var startTime = new Date();
	return function(req, res){	
		var totalOnlineTime = +(new Date()) - (+startTime);
		totalOnlineTime = (totalOnlineTime/1000).toFixed(0);
		res.send({startTime: startTime, totalSecs:totalOnlineTime});
	};

	})()
});

module.exports = routes;