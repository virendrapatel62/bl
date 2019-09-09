const jwt = require('jsonwebtoken')
module.exports = function(swig){
    swig.setFilter('createIdForHtml' , (product)=>{
        return (jwt.sign(product._id.toString() , "a").replace(/[^A-Za-z]/g,""));
        
    } )
}