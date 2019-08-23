const Router = require('express').Router()
const { Size } = require('./../../../models/materialModels/size')

Router.get('/',async (req,res) =>{
    const result = await Size.find().select()
    res.send(result)
});

Router.get('/:id',async (req,res) =>{
    const result = await Size.findById(req.params.id)
    res.send(result)
});

module.exports = Router