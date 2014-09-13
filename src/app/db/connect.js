
var config = require('./config'),
model = require('./model'),
mongoose = require('mongoose');

db = mongoose.connect(config.connectionURI);

module.exports =  {
	User: model.User(db),
	Session: model.Session(db),
	Trooper: model.Trooper(db),
	TrooperList: model.TrooperList(db)
};