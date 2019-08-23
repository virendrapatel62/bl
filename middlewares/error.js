const swig = require('swig')
const path = require('path')
const winston = require('winston')

// winston 
//error 
// info 
// silly 
// debug


module.exports = function(error , req , res , next){
    console.log(__filename);
    console.log(error)
    winston.log('error' , error.message , error);



    if(error.name == 'TokenExpiredError'){
        // reset password link expired
        const template = swig.compileFile(path.join(__dirname , '/../html/index.html'))
        res.send(template())
        logger('link expired ...')
    }else if(error.name == 'JsonWebTokenError'){
        //reset passwrd link invalid 
        logger('link invalid  ..')
    }else{
        // default error serve index page . home page
        const template = swig.compileFile(path.join(__dirname , '/../html/index.html'))
        res.send(template())
    }
}