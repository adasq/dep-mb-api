var uuid= require('node-uuid'),
crypto= require('crypto');

var SALT = "#DAYBreaker";

var Utils = {};


Utils.getUUID = function(){
	return uuid.v4();
};

Utils.getHashByPassword = function(pass){
	var result = new Buffer(crypto.pbkdf2Sync(pass, SALT, 25000, 128), 'binary').toString('hex');
	return result;
};




module.exports = Utils;