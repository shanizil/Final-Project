var mongoose = require('mongoose');
var schema = mongoose.Schema;

var likedByUserSchema = new schema({
    userID: {type:String, index:1,required:true},
    liked: [String],
    
}, {collection: 'likedByUser'});

var likedByUser = mongoose.model('likedByUser', likedByUserSchema);

module.exports = likedByUser;