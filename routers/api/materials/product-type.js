const Router = require('express').Router();
const {Product} = require('../../../models/materialModels/product');
const {ProductType} = require('../../../models/materialModels/product-type');


Router.get('/' , async (req , res)=>{
    const result  = await ProductType.find().populate('productCategory product').select();
    console.log(result);
    
    res.send(result);
})




module.exports = Router