const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    title:{
        type : String , 
        required : true,
    }
    , 
    description : {
        type : String , 
        required :true
    },
    images : {
        type : [String] , 
        required : false
    } , 
    productCategory : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'productCoreCategory' ,
        require : true
    }
})

const Product = mongoose.model('product', ProductSchema);
module.exports = { Product, ProductSchema }