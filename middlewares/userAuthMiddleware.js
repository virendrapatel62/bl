const logger = require('debug')('userAuthMiddleware')
const swig = require('swig')
const path = require('path')
module.exports = function(req , res , next){
    logger('this is user auth middled ware ')
    const user = req.session.user ;
    if(user){
        res.locals.user = user;
        next();
    }else{
        const template = swig.compileFile(path.join(__dirname , '/../html/userlogin.html'));
        res.status(401).send(template());
    }

}