const Router = require('express').Router()
const {ConstructionMaterial: constructionMaterial } = require('./../../../models/materialModels/construction-material')
const log = console.log;
Router.get('/',async (req,res) =>{
    var result = "Bad Request"
    try {
        result = await constructionMaterial.getAll();
    } catch (error) {
        log(error)
        res.status(400)
    }
    res.send(result)
});

// get detail of object by giving id
Router.get('/id/:id',async (req,res) =>{
    var result = "Bad Request"
    try {
        const id = req.params.id;
        result = await constructionMaterial.getById(id);
    } catch (error) {
        log(error)
        res.status(400)
    }
    res.send(result)
});

// detail of material by providing full name or abstract name
Router.get('/name/:name',async (req,res) =>{
    var result = "Bad Request"
    try {
        const name = req.params.name
        result = await constructionMaterial.getByName(name);
    } catch (error) {
        log(error)
        res.status(400)
    }
    res.send(result)
});

// size pass retuning brands
Router.get('/size/:size',async (req,res) =>{
    var result = "Bad Request"
    try {
        const size = req.params.size
        result = await constructionMaterial.getBySize(size);
    } catch (error) {
        log(error)
        res.status(400)
    }
    res.send(result)
});

Router.get('/brand/:brandid',async (req,res) =>{
    var result = "Bad Request"
    try {
        result = await constructionMaterial.getByBrand(req.params.brandid);
    } catch (error) {
        log(error)
        res.status(400)
    }
    res.send(result)
 });

module.exports = Router
