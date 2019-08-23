const Router = require('express').Router()
const { constructionMaterial } = require('./../../../models/materialModels/construction-material')

Router.get('/',async (req,res) =>{
   const result = await constructionMaterial.find().deeppopulate('subcategory').select()
    res.send(result)
});

Router.get('/:id',async (req,res) =>{
    const result = await constructionMaterial.findById(req.params.id).populate('subcategory')
    res.send(result)
});

// detail of material by providing full name or abstract name
Router.get('/name/:name',async (req,res) =>{
    const name = req.params.name
    const result = await constructionMaterial.find({
                        name:{
                            $regex: new RegExp(name,'i')
                        }
                    })
    res.send(result)
});


// size pass retuning brands
Router.get('/size/:size',async (req,res) =>{
    console.log(req.params.size)
    const result = await constructionMaterial.find().where({size:req.params.size}).select('brands')
    res.send(result)
});

// sub category  the nproduct 
Router.get('/subcategory/:subcategoryid',async (req,res) =>{
   const result = await constructionMaterial.findOne().where({subcategory:req.params.subcategoryid}).select()
    res.send(result)
});


module.exports = Router