var
_= require('underscore'),
MongoModel = require('./MongoModel');


var List = function(data) {
	
	var defaultData = {
		name: "",
	  	_creator: null,
	  	config: {
		    domain: 'com',
		    upgrade: false,
		    battle: false,
		    mission: false,
		    raid: false
	  	},
	  	troopers : []
	};
	if(data && _.isObject(data)){
		this.data = _.extend(defaultData, data);
	}else{
		this.data = defaultData;
	}
	




	this._constructor = List;
 	this._mongoCollection = 'TrooperList';
}


List.prototype = MongoModel.prototype;


module.exports = List;


