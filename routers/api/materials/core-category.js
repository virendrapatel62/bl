const Router = require('express').Router();
const {ProductCoreCategory} = require('../../../models/materialModels/product-core-category');

Router.get('/' , async (req , res)=>{
    const result  = await ProductCoreCategory.find().select();
    res.send(result);
})


module.exports = Router