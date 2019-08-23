const express = require('express')
const Router = express.Router();
const swig = require('swig')
const path = require('path')
const { User } = require('../../models/user');
const { Partner } = require('../../models/partner');
const { PartnerService } = require('../../models/partnerServices');
const partnerAuthMiddleware = require('../../middlewares/partnerAuthMiddleware');


// home page router for partner 
Router.get('/home', partnerAuthMiddleware, async (req, res) => {
    const template = swig.compileFile(path.join(__dirname, '/../../html/partner/partnerhomepage.html'))
    // session partner object
    const partner = res.locals.partner;

    // if partner has some seervice then ok if not sho message to complete his profile 
    const services = await PartnerService.find({ partner: partner._id })
        .select();
    // refresing the partner info 
    res.locals.partner = await Partner.findOne({ _id: partner._id })
        .select();
    // if no partner in session / simply show login page
    if (!partner) {
        res.redirect('/login/partnerloginpage');
        return;
    }

    // every thing is fine the show home page
    res.send(template({
        locals: res.locals,
        completeProfile: (services.length == 0) ? true : false
    }))
})

module.exports = Router;