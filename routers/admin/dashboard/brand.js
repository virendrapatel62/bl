const Router = require('express').Router();
const swig = require('swig')
const path = require('path')
const logger = require('debug')('products:Router')
const { ProductCoreCategory } = require('../../../models/materialModels/product-core-category');
const { Product } = require('../../../models/materialModels/products');
const { Brand } = require('../../../models/materialModels/brand');

// /admin/dashboard/brands

Router.post('/'  , async (req , res)=>{
    console.log(req.body);
    const body = req.body;
    const brand = new Brand({
        title :  body.brand , 
        product : body.product , 
        productCategory : body.category
    })

    const result = await brand.save();
    res.send(result)
    
})
module.exports = Router;