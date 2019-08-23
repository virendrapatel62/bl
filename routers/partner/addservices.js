const express= require('express')
const Router = express.Router();
const swig = require('swig')
const path = require('path')
const { User } = require('../../models/user');
const { CoreServices } = require('../../models/coreservices');
const { SubServices } = require('../../models/subservices');

const { Partner } = require('../../models/partner');
const { PartnerService } = require('../../models/partnerServices');
const partnerAuthMiddleware = require('../../middlewares/partnerAuthMiddleware');

Router.get('/'  , partnerAuthMiddleware , (req , res)=>{
    const template = swig.compileFile(path.join(__dirname , "/../../html/partner/addservices.html"))
    const partner = req.body.partner
    console.log(req.session.partner);
    
    res.send(template(
        {
            partner : partner
        }
    ));
})

Router.get('/getCoreServices'   , async(req , res)=>{
    const services = await CoreServices.find({
        subservices : {
            $not :{
                $size : 0
            }
        }
    }).select();
    // const arr = new Array();
    const result = eval(JSON.stringify(services));
    console.log(result);
    
    const partner = req.session.partner;
    for(var i in result){
        if(await PartnerService.findOne({ partner : partner._id , coreService : result[i]._id })){
            console.log('yes it is in getSUb');
            result[i].checked = true;
        }else{
            console.log('No it is in getSUb');
            result[i].checked = false;
        }
        
    }
    
    console.log(result);
    
    res.send(result)
})

Router.get('/getSubServices/:core' , async(req , res)=>{
    const services = await SubServices.find({coreservice : req.params.core}).select();
    const partner = req.session.partner;
    
    const result = eval(JSON.stringify(services));
    for(var i in result){
        if(await PartnerService.findOne({ partner : partner._id , service : result[i]._id })){
            console.log('yes it is in getSUb');
            result[i].checked = true;
        }else{
            console.log('No it is in getSUb');
            result[i].checked = false;
        }
    }
    res.send(result)
})


// adds service to PartnerService Schema by ajax
Router.get('/save/partner/service/:core/:sub' , async(req , res)=>{
    const core = req.params.core;
    const sub = req.params.sub;
    console.log('save service......');
    console.log(req.session.partner);
    
    if(!req.session.partner){
        res.status(401).send();
        return ;
    }
    const ps = new PartnerService({
        partner : req.session.partner._id,
        geometry : req.session.partner.location , 

        service : sub , 
        coreService : core 
    })

    const resutl = await ps.save();

    // const services = await SubServices.find({coreservice : req.params.core}).select();
     res.send(resutl)
})

// adds service to PartnerService Schema by ajax
Router.get('/delete/partner/service/:core/:sub' , async(req , res)=>{
    const core = req.params.core;
    const sub = req.params.sub;
    console.log('removing... seervice......');
    
    if(!req.session.partner){
        res.status(401).send();
        return ;
    }
    console.log(core);
    console.log(sub);
    console.log(req.session.partner._id);
    
    const result = await PartnerService.deleteMany({
        partner : req.session.partner._id , 
        service : sub  , 
        coreService : core
    })
    
    console.log(result);
    
    // const services = await SubServices.find({coreservice : req.params.core}).select();
     res.send(result)
})


module.exports = Router