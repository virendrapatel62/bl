const Router = require('express').Router();
const {Product} = require('../../../models/materialModels/product');

Router.get('/:categoryId' , async (req , res)=>{
    const id = req.params.categoryId;
    const result  = await Product.find({productCategory : id}).select();
    res.send(result);
})

Router.get('/' , async (req , res)=>{
    const result  = await Product.find().select();
    res.send(result);
})




module.exports = Router