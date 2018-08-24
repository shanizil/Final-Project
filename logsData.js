var mongoose = require('mongoose');
var schema = mongoose.Schema;

var logsSchema = new schema({
	// _id: {type: String, index:1, required:true, unique:true},
	logType: String,
	logsArr: []
}, {collection: 'logs'});

var Logs = mongoose.model('Logs', logsSchema);

module.exports = Logs;