var mongoose = require('mongoose');
var schema = mongoose.Schema;

var rateByUserSchema = new schema({
    userID: {type:String, index:1,required:true},
    rate:Array,
    
}, {collection: 'rateByUser'});

var rateByUser = mongoose.model('rateByUser', rateByUserSchema);

module.exports = rateByUser;