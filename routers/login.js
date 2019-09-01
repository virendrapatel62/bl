const express= require('express')
const Router = express.Router();
const swig = require('swig')
const path = require('path')
const { User } = require('../models/user');
const { Partner } = require('../models/partner');
const logger = require('debug')('login')
const passwordHash = require('password-hash')

// for login page

Router.get('/' , (req , res)=>{
    logger('serving loggin page to user')
        const teamplate = swig.compileFile(path.join(__dirname , '/../html/main/login.html' ));
    res.send(teamplate());
})

Router.post('/', async(req , res)=>{
    logger('login in process')
    
    const email  = req.body.email;
    const password = req.body.password;
    logger(passwordHash.generate(password))
    console.log(email , password);
    const user = await User.findOne({email : email});
    logger(user)
    logger(passwordHash.verify(user.password  , password))
    if(user && passwordHash.verify(password  , user.password)){
        req.session.user = user;
        res.send().status(200);
        return ;
    }else{
        res.status(401).send('Email or password invalid....');
        // res.end();
    }
})


// serves ther partner login page
Router.get('/partnerloginpage' , (req , res)=>{
    logger('serve partner login page')
    const teamplate = swig.compileFile(path.join(__dirname , "/../html/main/partner/login.html"))
    res.send(teamplate())
})


// partner login process
// accept email and password with the body of the request 
// post request 

Router.post('/partnerlogin' ,async(req , res)=>{
    const p = await Partner
                .findOne({email : req.body.email})
                .select();
    if(p && passwordHash.verify( req.body.password, p.password)){
        req.session.partner = p;
        res.send().status(200);
    }else{
        res.status(401).send();
    }
})

module.exports = Router;