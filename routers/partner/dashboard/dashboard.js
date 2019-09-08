const express = require('express')
const Router = express.Router();
const swig = require('swig')
const path = require('path')
//partner/dashboard
// Partner DashBoard

Router.get('/', (req, res) => {
    const template = swig.compileFile(path.join(__dirname, '/../../../html/partner/dashboard_html/dashboard.html'))
    console.log(req.session);
    
    res.send(template(
        {
            locals : {
                partner : req.session.partner
            }
        }
    ))
})



module.exports = Router;