const mongoose = require('mongoose')

const ProductCoreCategorySchema = new mongoose.Schema({
    title:{
        type : String , 
        required : true,
    }
    , 
    description : {
        type : String , 
        required :true
    },
    image : {
        type : String , 
        required : true
    }
})

//model
const ProductCoreCategory = mongoose.model('productCoreCategory', ProductCoreCategorySchema);


// methods

// get All Categories
ProductCoreCategory.getAll = function(){
    return new Promise(async(resolve , reject)=>{
        const result = await ProductCoreCategory.find().select();
        resolve(result);
    })
}

module.exports = { ProductCoreCategory, ProductCoreCategorySchema }