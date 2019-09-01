const express= require('express')
const Router = express.Router();
const swig = require('swig')
const logger = require('debug')('common.js:Router') 
Router.get('/contact' , (req , res)=>{
    res.locals.user = req.session.user;
    res.locals.partner = req.session.partner;
    const template  = swig.compileFile(require('path').join(__dirname , '../html/contact.html' ))
    // const template  = swig.compileFile(require('path').join(__dirname , '../html/main/contact.html' ))
    res.send(template(  
        { 
            locals : res.locals
        }
    ))
})

Router.get('/logout' , (req , res)=>{
    req.session.destroy(function(){
        console.log('logged out...');
    })
    // const template  = swig.compileFile(require('path').join(__dirname , '../html/main/index.html' ))
    const template  = swig.compileFile(require('path').join(__dirname , '../html/index.html' ))
    res.send(template());

})

Router.get('/about' , (req , res)=>{
    res.locals.user = req.session.user;
    res.locals.partner = req.session.partner;
    // const template  = swig.compileFile(require('path').join(__dirname , '../html/main/about.html' ))
    const template  = swig.compileFile(require('path').join(__dirname , '../html/about.html' ))
    res.send(template(
        {
            locals : res.locals
        }
    ));

})


module.exports = Router;