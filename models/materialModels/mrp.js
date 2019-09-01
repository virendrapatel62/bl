const mongoose = require('mongoose')


// Schema of the model
const MRPSchema = new mongoose.Schema({
    MRP:{
        type : Number , 
        required : true,
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'product' ,
        require : true
    }, 
    brand:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'brand',
        required : false
    },
    size:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'size',
        required : false
    },
    varient:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'varient',
        required : false
    }
})



// Model Class
const MRP = mongoose.model('mrp', MRPSchema);



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