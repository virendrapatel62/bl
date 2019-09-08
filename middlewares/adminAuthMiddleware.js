const express = require('express')
const swig = require('swig')
const path = require('path')
module.exports = function(req , res , next){
    // middle ware for Admin auth
    const admin = req.session.admin;
    console.log('admin auth middleware');
    console.log("admin : " ,  admin);
    
    if(admin){
        res.locals.admin = admin;
        next();
    }else{
        res.redirect('/admin')
    }
}