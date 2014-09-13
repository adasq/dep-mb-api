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
	url: "/xd2",
	callback: function(req, res){
		db.Message
    .findOne({author: "XXX"}) 
    .exec(function(err, msg){ 
          res.send({msg:msg});
    }); 
	}
});

module.exports = routes;