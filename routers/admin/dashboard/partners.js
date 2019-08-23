const Router = require('express').Router();
const swig = require('swig')
const path = require('path')
const { Partner } = require('../../../models/partner');
const { CoreServices } = require('../../../models/coreservices');
const { SubServices } = require('../../../models/subservices');
// admin/dashboard/partners


Router.get('/' , async(req , res)=>{
    const template = swig.compileFile(path.join(__dirname , '/../../../html/admin/partners.html'))
    res.send(template())
})



module.exports = Router;