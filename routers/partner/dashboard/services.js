const express= require('express')
const Router = express.Router();
const swig = require('swig')
const path = require('path')
const partnerAuthMiddleware = require('../../../middlewares/partnerAuthMiddleware');

Router.get('/'  , partnerAuthMiddleware , (req , res)=>{
    const template = swig.compileFile(path.join(__dirname , "/../../../html/partner/dashboard_html/select_services.html"))
    const partner = req.body.partner
    console.log(req.session.partner);
    
    res.send(template(
        {
            partner : partner
        }
    ));
})


module.exports = Router;