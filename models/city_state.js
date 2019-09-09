const mongoose = require('mongoose')
const stateSchema = new mongoose.Schema({
    name : {
        type : String , 
        required : true
    }
})

const State = mongoose.model('State' , stateSchema);

const citySchema = new mongoose.Schema({
    name : {
        type : String  , 
        required : true
    }
    , 
    state :{
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'State' , 
    } 

})

const City = mongoose.model('City' , citySchema);

module.exports = {City , State }
