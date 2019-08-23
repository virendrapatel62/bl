const mongoose = require('mongoose')

const coreServicesSchema = new mongoose.Schema({
    name : {
        type : String , 
        required : true
    } , 
    subservices : {
        type : [mongoose.Schema.Types.ObjectId] , 
        ref : 'SubServices'
    }
})


var deepPopulate = require('mongoose-deep-populate')(mongoose);
coreServicesSchema.plugin(deepPopulate, {
    whitelist: [
        'subservices'
    ]
});

const CoreServices  = mongoose.model('CoreServices' , coreServicesSchema);

module.exports = {coreServicesSchema , CoreServices }