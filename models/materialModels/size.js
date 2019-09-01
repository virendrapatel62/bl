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


module.exports = { Size, sizeSchema }

