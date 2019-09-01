const Router = require('express').Router()
const {ConstructionMaterial } = require('./../../../models/materialModels/construction-material')

Router.get('/',async (req,res) =>{
    const result = await ConstructionMaterial.getAll();
    res.send(result)
});

Router.get('/id/:id',async (req,res) =>{
    var id = req.params.id;
    const result = await ConstructionMaterial.getById(id);
    res.send(result)
});

// detail of material by providing full name or abstract name
Router.get('/name/:name',async (req,res) =>{
    const name = req.params.name
    const result = await ConstructionMaterial.getByName(name);
    res.send(result)
});


// size pass retuning Product
Router.get('/size/:size',async (req,res) =>{
    let size = req.params.size
    const result = await ConstructionMaterial.getBySize(size);
    console.log(result);
    res.send(result)
});

Router.get('/brand/:brandid',async (req,res) =>{
    const result = await ConstructionMaterial.getByBrand(req.params.brandid);
    res.send(result)
 });


module.exports = Router
