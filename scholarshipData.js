const mongoose = require('mongoose'),
    schema = mongoose.Schema;


    scholarshipsSchema = new schema({
    name: {type:String, index:1,required:true},
    description:String,
    tel:String,
    dueDate:String,
    origin:String,
    location:String,
    volunteering:String,
    reservist:String,
    veteran:String,
    choose:String,
    img:String,

}, {collection: 'scholarships'}),

scholarships= mongoose.model('scholarships',scholarshipsSchema);
module.exports=scholarships;


console.log(`required paths: ${scholarshipsSchema.requiredPaths()}`);
console.log(`indexes: ${JSON.stringify(scholarshipsSchema.indexes())}`);