const Router = require('express').Router();
const { ProductCoreCategory } = require('../../../models/materialModels/product-core-category');
const { Brand } = require('../../../models/materialModels/brand');

Router.get('/', async (req, res) => {
    const result = await Brand.find().populate('productCategory product').select();
    res.send(result);
})

Router.get('/:id', async(req,res)=>{
    const result = await Brand.findOne({_id:req.params.id}).populate('productCategory product')
    res.send(result)
})



module.exports = Router