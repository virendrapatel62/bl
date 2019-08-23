const Router = require('express').Router()
const partnerAuthMiddleware = require('../../middlewares/partnerAuthMiddleware')
const swig = require('swig')
const { Partner } = require('../../models/partner')
const { State , City } = require('../../models/city_state')
const Path = require('path')
const passwordhash = require('password-hash')

Router.get('/',partnerAuthMiddleware,async(req,res)=>{  
    const template = swig.compileFile(Path.join(__dirname,"/../../html/partner/partnerprofile.html"))
    const partner = await Partner.findById(res.locals.partner._id).populate('state city');
    const countrycodes = require('../../utils/countrycode');
    const states = await State.find().select();
    const cities = await City.find({state:partner.state._id}).select();
    console.log(partner);
    res.send(template({
        locals : res.locals,
        partner : partner,
        states : states,
        cities : cities,
        countrycodes : countrycodes
    }));
})

Router.post('/details' ,partnerAuthMiddleware, async (req,res)=>{

    const Joi = require('joi');
    const custJoi =  Joi.extend(require('joi-phone-number'));
 
    const vschema = {
        name : custJoi.string().min(3).required(),
        contact : custJoi.string().min(10).max(10).phoneNumber().required(),
        code : custJoi.string().min(2).required()
    }
 
    const result = custJoi.validate(req.body,vschema);
 
    if (result.error){
         res.status(406).send(result.error.message);
         return;
     }else{
         try {
             const result = await Partner.findByIdAndUpdate(res.locals.partner._id,{
                 name : req.body.name,
                 contact : req.body.contact
             },{
                 new :true
             }).populate('state city');
             res.status(200).send();   
             return;
         } catch (error) {
             res.status(500).send('internal error');
             return;
         }
     }
 });

 Router.post('/address' , partnerAuthMiddleware , async (req,res)=>{
    const Joi = require('joi');
    Joi.objectId = require('joi-objectid')(Joi);

    const vaschema = {
        state : Joi.objectId().required(),
        city : Joi.objectId().required(),
        address : Joi.string().min(10).max(250).required(),
        zipcode : Joi.string().length(6).required(),
        locality : Joi.string().required(),
        landmark : Joi.string()
    }

    const result = Joi.validate(req.body, vaschema);
     
    const modaddress = {
        address : req.body.address,
        zipcode : req.body.zipcode,
        locality : req.body.locality,
        landmark : req.body.landmark
    } 

    if (modaddress.landmark === undefined){
        delete modaddress.landmark;
    } 
    
    if (result.error){
        res.status(406).send(result.error.message);
        console.log("###########################################################");
        console.log(req.body);
        return;
    }else{
        try {
            const result = await Partner.findByIdAndUpdate(res.locals.partner._id,{
                city : req.body.city,
                state : req.body.state,
                ...modaddress
            },{
                new :true
            }).populate('state city');
            res.status(200).send();   
            return;
        } catch (error) {
            res.status(500).send('internal error');
            return;
        }
    }
});

Router.post('/updatepassword', partnerAuthMiddleware , async(req,res)=>{
    const Joi = require('joi');
    const vschema = {
        oldpassword: Joi.string().min(8),
        newpassword : Joi.string().min(8),
        confirmpassword : Joi.string().min(8),
    }
    const validationresult = Joi.validate(req.body,vschema)
    if (validationresult.error){
        res.status(406).send(validationresult.error)
        return;
    }else{
        console.log(req.body);
        if (req.body.newpassword.trim()===req.body.confirmpassword.trim()){
            let flag = passwordhash.verify(req.body.oldpassword,res.locals.partner.password)
            if (flag){
                try {
                    const result = await Partner.findByIdAndUpdate(res.locals.partner._id,{
                        password : passwordhash.generate(req.body.newpassword)
                    },{new : true})

                    console.log(result);
                    res.status(200).send()
                } catch (error) {
                    res.send(500).send("internal error ocuurs");
                }
                return;
            }else{
                res.status(406).send("old password is wrong")
                return;
            }
        }else{
            res.status(203).send('new password and confirm password are not same');
            return;
        }
    }
}); 

module.exports = Router;