const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true 
    } , 
    email : {
        type : String , 
        required : true , 
        minlength : 6
    } , 
    password : {
        type : String , 
        required  : true
    } , 
    contact  : {
        type : String , 
        minlength : 10, 
        maxlength : 13
    },
    city : {
        type : mongoose.Schema.Types.ObjectId ,
        ref  : "City" ,  
        required : false
    },
    
    state : {
        type : mongoose.Schema.Types.ObjectId ,
        ref  : "State" ,
        required : false
    } , 
    address : {
        type :String , 
        required : true
    } ,
    zipcode : {
        type :String , 
        required : false
    } , 
    landmark : {
        type : String,
        required : false
    },
    locality : {
        type : String,
        minlength : 3,
        required : true
    },
    lat : String , 
    lng : String

})

const User = mongoose.model('User' , userSchema);
console.log(User);


function validateUser(user){
    const Joi = require('joi')
    const schema = {
        name : Joi.string().min(4).max(50).required() , 
        email : Joi.string().max(30).min(5).required().email(), 
        password : Joi.string().min(8).max(500).required(),
        contact : Joi.string().min(10).max(13).required() , 
        address : Joi.string().min(4).max(300).required() , 
        state : Joi.string(), 
        city : Joi.string(), 
        lat : Joi.string(), 
        lng : Joi.string(), 
    }

    const result = Joi.validate(user , schema);
    return result.error;

}
module.exports = { User  , userSchema  , validateUser };