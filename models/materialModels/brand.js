const mongoose = require('mongoose')


// Schema of the model
const brandSchema = new mongoose.Schema({
    title:{
        type : String , 
        required : true,
    }, 
    description:{
        type : String , 
        required : false,
    }
    ,
    productCategory : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'productCoreCategory' ,
        require : true
    }, 
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'product' ,
        require : true
    },
    productType : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'productType' ,
        require : false
    },
    images : {
        type : [String] , 
        required : true
    } ,
})



// Model Class
const Brand = mongoose.model('brand', brandSchema);



// get All
// works as a static method 
// call like --> Brand.getAll();
Brand.getAll = function(){
    return new Promise(async(resolve , reject)=>{
        const result = await Brand.find().select();
        console.log("brand.js  + Brand.prototype.getAll");
        resolve(result)
    });
}




// Exporting Schema and Model
module.exports = { Brand, brandSchema }