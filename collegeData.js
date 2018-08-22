var mongoose = require('mongoose');
var schema = mongoose.Schema;

var collegeSchema = new schema({
    // _id: {type: String, index:1, required:true},
    collegId: Number,           // done
    engName: String,            // done
    hebName: String,            // done
    headline: String,           // done
    logo: String,               // in DB
    address: String,            // done
    tuitionFee: String,         // done
    dorms: String,              // done
    tel: String,                // done
    openday: String,            // done
    description: String,        // done
    requirements: Array,        // done
    specialization: String,     // done
    reqUrl: String,
    pic: String,
    type: String,
    location: String,
    uniSalary: String,
    subEng: [String],
    latitude: Number ,
    longitude: Number,
    rating: Number,
    // scholarships: Array,
    averageRents: Array,
    psychometry: Number,
    mathGrades: Array,
    engGrades: Array,
    physicsGrades: Array,

}, {collection: 'Colleges'});

var College = mongoose.model('College', collegeSchema);

module.exports = College;