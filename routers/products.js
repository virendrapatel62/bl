const Router = require('express').Router();
const swig = require('swig')
const path  = require('path')
const {Product} = require('../models/materialModels/products')
Router.get('/' , (req , res) =>{
    // res.locals.user = req.session.user;
    // res.locals.partner = req.session.partner;
    // // throw new Error('somthing wrong..')
    const template = swig.compileFile(path.join(__dirname + "/../html/products.html"))
    res.send(template({
        locals : res.locals
    }))
})


Router.get('/all-products' , async(req, res)=>{
    const result = await Product.find();
    console.log(result);
    res.send(result);
})

module.exports = Router