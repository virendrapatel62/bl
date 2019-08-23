const Router = require('express').Router();
const { State, City} = require('../../models/city_state');

Router.get('/' , async (req , res)=>{
    const result  = await State.find().select();
    res.send(result);
})

Router.get('/getcities/:stateid' , async (req , res)=>{
    const result  = await City.find({state: req.params.stateid}).select('-state');
    res.send(result);
})

module.exports = Router