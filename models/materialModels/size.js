const mongoose = require('mongoose')

const sizeSchema = new mongoose.Schema({
    size:{
        type : String , 
        required : true,
    }, 
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'constructionMaterial' ,
        require : true
    },
    description:{
        type : String , 
        required : false,
    },
    brand:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'brand',
        required : false
    }, 
    images : [
        {
            type : String , 
            default : []
        }
    ]

})



const Size = mongoose.model('size', sizeSchema);

sizeSchema.methods.toString = function(){
    console.log(this);
    
}

// get All
// works as a static method 
// call like --> Size.getAll();
Size.getAll = function(){
    return new Promise(async(resolve , reject)=>{
        const result = await Size.find().select();
        console.log("size.js  + Size.getAll");
        resolve(result)
    });
}

// get Sizes by Product 
Size.getByProduct = function(product){
    return new Promise(async(resolve , reject)=>{
        const result = await Size.find({product : product }).select();
        resolve(result)
    });
}

// get Sizes by brand 
Size.getByBrand = function(brand){
    return new Promise(async(resolve , reject)=>{
        const result = await Size.find({brand : brand }).select();
        resolve(result)
    });
}



module.exports = { Size, sizeSchema }

