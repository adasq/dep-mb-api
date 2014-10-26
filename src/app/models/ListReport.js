var MongoModel = require('./MongoModel');


var ListReport = function(data) {
	this.data = data || {};
	this._constructor = ListReport;
 	this._mongoCollection = 'ListReport';
}


ListReport.prototype = MongoModel.prototype;


module.exports = ListReport;


