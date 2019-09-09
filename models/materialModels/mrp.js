const mongoose = require('mongoose')
const {CollectionNames} = require('../../constants/collection-names')


// Schema of the model
const MRPSchema = new mongoose.Schema({
    MRP:{
        type : Number , 
        required : true,
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : CollectionNames.PRODUCTS ,
        require : true
    }, 
    brand:{
        type: mongoose.Schema.Types.ObjectId,
        ref : CollectionNames.BRAND,
        required : false
    },
    size:{
        type: mongoose.Schema.Types.ObjectId,
        ref : CollectionNames.SIZE,
        required : false
    },
    varient:{
        type: mongoose.Schema.Types.ObjectId,
        ref : CollectionNames.VARIENT,
        required : false
    }
})



// Model Class
const MRP = mongoose.model( CollectionNames.MRP, MRPSchema);



// get All
// works as a static method 
// call like --> Varient.getAll();
MRP.getAll = function(){
    return new Promise(async(resolve , reject)=>{
        const result = await MRP.find().select();
        console.log("mrp.js  + mrp.getAll");
        resolve(result)
    });
}




// Exporting Schema and Model
module.exports = { MRP, MRPSchema }