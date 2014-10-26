
var config = require('./config'),
model = require('./model'),
mongoose = require('mongoose');

db = mongoose.connect(config.connectionURI);

module.exports =  {
	User: model.User(db),
	Session: model.Session(db),
	Trooper: model.Trooper(db),
	ListReport: model.ListReport(db),
	TrooperList: model.TrooperList(db),
	TrooperReport: model.TrooperReport(db),
	//TrooperListReport: model.TrooperListReport(db)
};