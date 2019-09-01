const mongoose = require('mongoose')


// Schema of the model
const varientSchema = new mongoose.Schema({
    varient:{
        type : String , 
        required : true,
    }, 
    description:{
        type : String , 
        required : false,
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'constructionMaterial' ,
        require : true
    }, 
    brand:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'brand',
        required : false
    }
})



// Model Class
const Varient = mongoose.model('varient', varientSchema);



// get All
// works as a static method 
// call like --> Varient.getAll();
Varient.getAll = function(){
    return new Promise(async(resolve , reject)=>{
        const result = await Varient.find().select();
        console.log("varient.js  + Varient.getAll");
        resolve(result)
    });
}




// Exporting Schema and Model
module.exports = { Varient, varientSchema }