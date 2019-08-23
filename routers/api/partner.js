const Router = require('express').Router();
const {Partner} = require('../../models/partner');
const {PartnerService} = require('../../models/partnerServices');

Router.get('/' , async (req , res)=>{
    const result  = await Partner.find().populate('city state').select();
    
    res.send({
        data : result
    });


})




module.exports = Router