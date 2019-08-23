const Router = require('express').Router();
const swig = require('swig')
const path  = require('path')
Router.get('/' , (req , res) =>{
    res.locals.user = req.session.user;
    res.locals.partner = req.session.partner;
    // throw new Error('somthing wrong..')
    const template = swig.compileFile(path.join(__dirname + "/../html/index.html"))
    res.send(template({
        locals : res.locals
    }))
})

module.exports = Router