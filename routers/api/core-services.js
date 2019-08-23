const Router = require('express').Router()
const {CoreServices}  = require('../../models/coreservices');


Router.get('/' , async(req , res )=>{
    const services = await CoreServices.find().deepPopulate('subservices').select();
    res.send(services);
})

module.exports = Router;