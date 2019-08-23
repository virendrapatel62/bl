const mongoose = require('mongoose')

const subServicesSchema = new mongoose.Schema({
    name : {
        type : String , 
        required : true
    } , 
    coreservice : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'CoreServices'
    } , 
    image : {
        type : String  , 
        get : function(value){
            return value.replace(/\\/g, "/");
        }

    }
})

const SubServices  = mongoose.model('SubServices' , subServicesSchema);

module.exports = {subServicesSchema , SubServices }