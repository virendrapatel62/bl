const Router = require('express').Router();
const {City} = require('../../models/city_state');

Router.get('/' , async (req , res)=>{
    const result  = await City.find().populate('state').select();
    res.send(result);
})

module.exports = Router