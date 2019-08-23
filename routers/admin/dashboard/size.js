const Router = require('express').Router();
const swig = require('swig')
const path = require('path')
const logger = require('debug')('products:Router')
const { ProductCoreCategory } = require('../../../models/materialModels/product-core-category');
const { Product } = require('../../../models/materialModels/product');
const { Brand } = require('../../../models/materialModels/brand');
const { Size } = require('../../../models/materialModels/size');

// /admin/dashboard/brands

// save size
Router.post('/'  , async (req , res)=>{
    console.log(req.body);
    const body = req.body;
    const size = new Size({
        size :  body.size , 
        product : body.product , 
        sUnit : body.sUnit , 
        pUnit : body.pUnit , 
        productCategory : body.category
    })

    const result = await size.save();
    console.log(result);
    
    res.send(result)
    
})

module.exports = Router;