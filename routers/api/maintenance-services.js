const Router = require('express').Router()

const {MaintenanceSubServices}  = require('../../models/maintenance-sub-services');
const {CoreServices}  = require('../../models/coreservices');
const {SubServices}  = require('../../models/subservices');

Router.get('/' , async(req , res)=>{
    const services = await MaintenanceSubServices.find().populate('coreService').select();
    // const a = JSON.stringify(services)
    res.send(services)    
})

Router.get('/core' , async(req , res)=>{
    const services = await CoreServices.find().populate().select();
    // const a = JSON.stringify(services)
    res.send(services)    
})
Router.get('/core/:id' , async(req , res)=>{
    const services = await CoreServices.findOne({_id : req.params.id}).populate().select();
    const sub = await SubServices.find({
        _id : {
            $in :services.subservices
        }
    }).select();
    var x = {};
    x.name = services.name;
    x._id = services._id.toString();
    x.subservices = sub
    // const a = JSON.stringify(services)
    res.send(x)    
})


module.exports = Router;

