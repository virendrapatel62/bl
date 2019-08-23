const Router = require('express').Router();
const {User} = require('../../models/user');

Router.get('/' , async (req , res)=>{
    
    const result  = await User.find().select();

    res.send(result);
})


module.exports = Router