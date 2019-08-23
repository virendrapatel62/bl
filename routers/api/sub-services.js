const Router = require('express').Router()
const {SubServices}  = require('../../models/subservices');


Router.get('/' , async(req , res )=>{
    const services = await SubServices.find().populate('coreservice').select();
    res.send(services);
})

Router.get('/:coreServiceId' , async(req , res )=>{
    const services = await SubServices.find({coreservice : req.params.coreServiceId}).select();
    res.send(services);
})

module.exports = Router;