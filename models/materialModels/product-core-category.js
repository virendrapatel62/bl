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

const ProductCoreCategory = mongoose.model('productCoreCategory', ProductCoreCategorySchema);
module.exports = { ProductCoreCategory, ProductCoreCategorySchema }