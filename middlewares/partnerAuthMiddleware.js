const express = require('express')
const swig = require('swig')
const path = require('path')
module.exports = function(req , res , next){
    // middle ware for partner auth
    const partner = req.session.partner;
    console.log('partber auth middleware');
    console.log("Partner : " ,  partner);
    
    if(partner){
        res.locals.partner = partner;
        next();
    }else{
        res.status(401).send(
            swig.compileFile(
                path.join(__dirname , "/../html/userlogin.html"))()
                );
    }
}