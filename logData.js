var mongoose = require('mongoose');
var schema = mongoose.Schema;

var logSchema = new schema({
	_id: {type: String},
	logData: String,
	logDate: String
}, {collection: 'logs'});

var Log = mongoose.model('Log', logSchema);

module.exports = Log;