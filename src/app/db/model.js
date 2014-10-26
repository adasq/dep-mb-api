
var mongoose = require('mongoose'),
uniqueValidator = require('mongoose-unique-validator');
Schema = mongoose.Schema;


//------------------------------------------
var ListReport = new Schema({
   _creator : {type: Schema.Types.ObjectId, ref: 'TrooperList' },
   handled  : {type: Boolean, default: false},
   date   : {type: Date, default: new Date()},
  //==========================================================
  trooperReports: [{ 
    authState: { code: {type: Number, default: 0}, message: {type: String, default: 0} },
    reportState: {type: Number, default: 0},
    time:{ 
      start: {type: Date},
      end: {type: Date} 
   },
   fights: {
      battle: [],
      mission: [],
      raid: [] },
  skills: [],
  money: {type: Number, default: 0},
  needToUpgrade: {type: Number, default: 0},
  upgrade: { isAvailable: {type: Boolean, default: false}, skills: [{
    mbSkillId: {type: Number, default: 0},
    skillId: {type: Number, default: 0}
  }] } 
}] 
});

mongoose.model('ListReport', ListReport);
exports.ListReport = function(db) {
  return db.model('ListReport');
};
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
  pass: {type: String, required: false}
});
mongoose.model('Trooper', Trooper);
exports.Trooper = function(db) {
  return db.model('Trooper');
};
//------------------------------------------
var TrooperList = new Schema({
  name     : {type: String, required: true},
  _creator: { type: Schema.Types.ObjectId, ref: 'User' },
  config: {
    domain: {type: String, default: 'com'},
    upgrade: {type: Boolean, default: false},
    battle: {type: Boolean, default: false},
    mission: {type: Boolean, default: false},
    raid: {type: Boolean, default: false}
  },
  troopers : [Trooper]
});

mongoose.model('TrooperList', TrooperList);
exports.TrooperList = function(db) {
  return db.model('TrooperList');
};
//------------------------------------------
var TrooperReport = new Schema({
  report: {type: String, required: true},
});

mongoose.model('TrooperReport', TrooperReport);
exports.TrooperReport = function(db) {
  return db.model('TrooperReport');
};



 
