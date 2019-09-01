const mongoose = require('mongoose')


// Schema of the model
const brandSchema = new mongoose.Schema({
    brand:{
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
        ref : 'constructionMaterial' ,
        require : true
    },
    images : {
        type : [String] , 
        required : false
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

// get brands of products /// by product Id
Brand.getByProduct = function(product){
    return new Promise(async(resolve , reject)=>{
        const result = await Brand.find({product : product}).select();
        console.log("brand.js  + Brand.prototype.getById");
        resolve(result)
    });
}




// Exporting Schema and Model
module.exports = { Brand, brandSchema }