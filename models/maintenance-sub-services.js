const mongoose = require('mongoose')

const maintenanceSubServicesSchema = new mongoose.Schema({
    name : {
        type : String , 
        required : true
    } ,
    description : {
        type : String , 
        required : true
    },
    serviceCharge : {
        type : Number , 
        required : false , 
        default : 0 , 
        
    }, 
    coreService:{
        type : mongoose.Schema.Types.ObjectId , 
        ref : "SubServices"
    },

    image : {
        type : String  , 
        get : function(value){
            return value.replace(/\\/g, "/");
        }  , 
        set : function(value){
            return value.replace(/\\/g, "/");
        }

    }
})

const MaintenanceSubServices  = mongoose.model('MaintenanceServices' , maintenanceSubServicesSchema);

module.exports = {MaintenanceSubServices , maintenanceSubServicesSchema }