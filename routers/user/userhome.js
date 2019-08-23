const express= require('express')
const Router = express.Router();
const swig = require('swig')
const path = require('path')
const { User } = require('../../models/user');
const userAuthMiddleware = require('../../middlewares/userAuthMiddleware')


Router.get('/', userAuthMiddleware , (req , res)=>{
    const template = swig.compileFile(path.join(__dirname , "/../../html/user/userhome.html"))
    res.send(template({
        locals : res.locals
    }))
})

module.exports = Router