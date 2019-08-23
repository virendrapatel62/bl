const Router = require('express').Router()
const { constructionMaterial } = require('./../../../models/materialModels/construction-material')

Router.get('/',async (req,res) =>{
    const result = await constructionMaterial.getAll();
    res.send(result)
});

Router.get('/id/:id',async (req,res) =>{
    var id = req.params.id;
    const result = await constructionMaterial.getById(id);
    res.send(result)
});

// detail of material by providing full name or abstract name
Router.get('/name/:name',async (req,res) =>{
    const name = req.params.name
    const result = await constructionMaterial.getByName(name);
    res.send(result)
});


// size pass retuning brands
Router.get('/size/:size',async (req,res) =>{
    let size = req.params.size
    const result = await constructionMaterial.getBySize(size);
    console.log(result);
    res.send(result)
});

// sub category  the nproduct 
Router.get('/subcategory/:subcategoryid',async (req,res) =>{
    const result = await constructionMaterial.getBySubCategory(req.params.subcategoryid);
    res.send(result)
});


module.exports = Router