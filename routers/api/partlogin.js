const Router = require('express').Router();
const { Partner } = require('../../models/partner');
const config = require('config')
const jwt = require('jsonwebtoken')

function ValidatePartner(partner){
    const joi = require('joi');
    const schema = {
        email : joi.string().max(30).min(5).email().required(),
        password : joi.string().min(8).max(50).required()
    }
    const result = joi.validate(partner, schema);
    return result.error;
}

// partner login 
Router.post('/',async (req,res)=>{
    const err = ValidatePartner(req.body);
    if(err){
        res.status(422).send(err.details[0].message);
        return;
    }else{
        try {
            // checking creadentials 
            const result = await Partner.login(req.body.email,req.body.password)
            const token = jwt.sign(
                {
                    partner : result._id
                },config.get('api_private_key')
            );

            res.send({
                partner: result,
                token: token
            })

        } catch (error) {
            res.status(401).send("email or password invalid");
            return;
        }
    }
})

module.exports = Router