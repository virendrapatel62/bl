const mongoose = require('mongoose')


// Schema of the model
const partnerProductSchema = new mongoose.Schema({
    partner:{
        type : mongoose.Schema.Types.ObjectId , 
        required : true,
    }, 
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'constructionMaterial' ,
        require : true
    },
    prize : {
        type : Number , 
        required : true , 
        default : 0
    },
    mrp : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'mrp' ,
        require : true
    }
})



// Model Class
const PartnerProduct = mongoose.model('partnerProduct', partnerProductSchema);

PartnerProduct.prototype.isExists  =  function(){
    return new Promise(async(resolve , reject )=>{
        const count  = await PartnerProduct.find({
            mrp : this.mrp , 
            product : this.product ,
            prize : this.prize , 
            partner : this.partner
        }).count();
    
        resolve (count > 0 ? true : false);
    })
    
}

// Exporting Schema and Model
module.exports = { PartnerProduct , partnerProductSchema }