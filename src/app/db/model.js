
var mongoose = require('mongoose'),
uniqueValidator = require('mongoose-unique-validator');
Schema = mongoose.Schema;

//------------------------------------------
var User = new Schema({
   name     : {type: String, unique: true, required: true}, 
   pass     : {type: String, required: true},
   mail     : {type: String, unique: true, required: true},   
   state	: {type: Number, default: 0},
   deleted 	: {type: Boolean, default: false},
   regDate	: {type: Date, default: new Date()},
   sessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }]
});

User.plugin(uniqueValidator);



mongoose.model('User', User);
exports.User = function(db) {
  return db.model('User');
};
//------------------------------------------
var Session = new Schema({ 
   userAgent     : {type: String, required: true}, 
   accessToken     : {type: String, required: true},
   expired   : {type: Boolean, default: false},
   initDate  : {type: Date, default: new Date()}
});

mongoose.model('Session', Session);
exports.Session = function(db) {
  return db.model('Session');
};
//------------------------------------------
var Trooper = new Schema({
  name: {type: String, required: true},
  pass: {type: String, required: false},
});

mongoose.model('Trooper', Trooper);
exports.Trooper = function(db) {
  return db.model('Trooper');
};
//------------------------------------------
var TrooperList = new Schema({
  name     : {type: String, required: true},
  _creator: { type: Schema.Types.ObjectId, ref: 'User' }, 
  troopers : [Trooper]
});

mongoose.model('TrooperList', TrooperList);
exports.TrooperList = function(db) {
  return db.model('TrooperList');
};
//------------------------------------------


 
