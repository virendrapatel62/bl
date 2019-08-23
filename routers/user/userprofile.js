const express = require('express');
const Router = express.Router();
const swig = require('swig');
const passwordhash = require('password-hash');
const path = require('path');
const { User } = require('../../models/user');
const { State , City } = require('../../models/city_state');
const userAuthMiddleware = require('../../middlewares/userAuthMiddleware');

Router.get('/', userAuthMiddleware , async (req,res)=>{
    const template = swig.compileFile(path.join(__dirname , "/../../html/user/userprofile.html"))
    const user = await User.findById(res.locals.user._id).populate('state city');
    const countrycodes = require('../../utils/countrycode');
    const states = await State.find().select();
    const cities = await City.find({state:user.state._id}).select();
    console.log(res.locals.user);
    
    res.send(template({
        locals : res.locals,
        user : user,
        states : states,
        cities : cities,
        countrycodes : countrycodes
    }))
});

Router.post('/updatepassword', userAuthMiddleware, async(req,res)=>{
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
        if (req.body.newpassword.trim()===req.body.confirmpassword.trim()){
            let flag = passwordhash.verify(req.body.oldpassword,res.locals.user.password)
            if (flag){
                try {
                    const result = await User.findByIdAndUpdate(res.locals.user._id,{
                        password : passwordhash.generate(req.body.newpassword)
                    },{new : true})

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

Router.post('/address' , userAuthMiddleware , async (req,res)=>{
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
        return;
    }else{
        try {
            const result = await User.findByIdAndUpdate(res.locals.user._id,{
                city : req.body.city,
                state : req.body.state,
                ...modaddress
            },{
                new :true
            }).populate('state city');
            res.status(200).send();   
            return;
        } catch (error) {
            console.log(error);
            
            res.status(500).send('internal error');
            return;
        }
    }
});

Router.post('/details' ,userAuthMiddleware, async (req,res)=>{

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
            const result = await User.findByIdAndUpdate(res.locals.user._id,{
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

module.exports = Router