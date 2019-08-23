const express = require('express')
const Router = express.Router();
const swig = require('swig')
const path = require('path')
const { User } = require('../models/user');
const { Partner } = require('../models/partner');
const logger = require('debug')('login')
const passwordHash = require('password-hash')
const jwt = require('jsonwebtoken')
const mailsender = require('./utility/mailsender')
const privateKey = 'buildovopasswordreset';
const Joi = require('joi')


// reset link from gmail 
Router.get('/:token', (req, res) => {
    logger(req.params.token)
    try {
        const user = jwt.verify(req.params.token, privateKey);
        const template = swig.compileFile(path.join(__dirname , "/../html/password-reset/password-reset.html"));
        res.send(template({
            user : user,
            token : req.params.token
        }))
    } catch (error) {
        if(error.name == 'TokenExpiredError'){
            logger('link expired ...')
            res.send('link expired ...')
        }else if(error.name == 'JsonWebTokenError'){
            logger('link invalid  ..')
            res.send('link invalid   ...')
        }else{
            logger(error)
        }
    }
    
    // res.send('okk')
})


// changing password is done here
Router.post('/',async (req, res) => {
   try{
       const userpartner = jwt.verify(req.body.token,privateKey);

       if (userpartner.isUser){
           // if he is normal user
            const result = await User.findById(userpartner.id).update({
                password : passwordHash.generate(req.body.password)
            });
       } else if (userpartner.isPartner){
           // if he is partner
            const result = await Partner.findById(userpartner.id).update({
                password : passwordHash.generate(req.body.password)
            });
       }
       
       res.status(200).send("Password is updated");
       return
    }catch(error){
        console.error(error)
        if(error.name == 'TokenExpiredError'){
            res.status(406).send('Link is expired')
        }else if(error.name == 'JsonWebTokenError'){
            res.status(406).send('Link is expired')
        }else{
            res.status(500).send("internal error");
        }
        return
    }
})


// sending link to user or partner
Router.get('/send-link/:whoIs/:email', async (req, res) => {
    logger(req.params.email);
    logger(req.params.whoIs);
    const email = req.params.email;
    const whois = req.params.whoIs;
    
    // for authentication that user is partner or normal user
    var isPartner = false; 
    var isUser = false; 

    var user = null;
    
    // the user who is sending reset password request 
    // who is he , user or partner
    if (whois == 'partner') {
        user = await Partner.findOne({ email: email }).select('email password name');
        isPartner  = true;
    } else if (whois == 'user') {
        isUser = true;
        user = await User.findOne({ email: email }).select('email password name');
    }

    const token = jwt.sign({
        email: user.email,
        password: user.password,
        id: user._id.toString(),
        isUser : isUser,
        isPartner : isPartner
    }, privateKey, { expiresIn: 60 * 60});

    logger(user) 
    logger(token)
    mailsender(user.email, 'Password Change', { 'token': token , 'user' : user }, 'Reset-Password/index.html');
    res.send()
    // swig.compileFile(path.join(__dirname  , "/../html/reset-password.html"));
})

module.exports = Router;