const mongoose = require('mongoose')

const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    registrationTime : {
        date : {
            type : Date , 
            default : Date.now()
        },
        time : {
            type : Number , 
            default : new Date().getTime()
        },
        year : {
            type : Number , 
            default : new Date().getFullYear()
        },
        month : {
            type : Number , 
            default : new Date().getMonth()
        },
    },
    email: {
        type: String,
        required: true,
        minlength: 6
    },
    idproof: {
        path: {
            type: String,
            
        },
        filename: String,

    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        minlength: 10,
        maxlength: 13
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        required: false
    },
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
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'blocked', 'deleted', 'decline'],
        default: 'pending'
    }

})

var deepPopulate = require('mongoose-deep-populate')(mongoose);
partnerSchema.plugin(deepPopulate, {
    whitelist: [
        'city', 'state'
    ]
});



function validatePartner(partner) {
    const Joi = require('joi');
    const schema = {
        name: Joi.string().min(4).max(50).required(),
        email: Joi.string().min(5).max(60).email().required(),
        password: Joi.string().min(6).max(500).required(),
        address: Joi.string().min(5).max(500).required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        contact: Joi.string().max(13).min(10).required()
    }
    const result = Joi.validate(partner, schema);
    return result.error;
}


const Partner = mongoose.model('Partner', partnerSchema);
module.exports = { Partner, partnerSchema, validatePartner }