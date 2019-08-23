const mongoose = require('mongoose')

const sizeSchema = new mongoose.Schema({
    size:{
        type : String , 
        required : true,
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
    pUnit:{
        type : String , 
        required : true,
    },
    sUnit:{
        type : String , 
        required : true,
    }

})

const Size = mongoose.model('size', sizeSchema);
module.exports = { Size, sizeSchema }