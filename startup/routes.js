const express = require('express')
module.exports = function (app) {

    //inbuilt middlewares 
    {
        app.use(express.json())
        app.use(express.urlencoded())
        app.use(require('body-parser').urlencoded({ extended: false }))
        app.use(require('body-parser').json())
    }

    // utility
    // dounload image 
    {
        app.use('/file', require('../routers/utility/download'))
    }


    // user routes 
    {
        app.use('/user', require('../routers/user/userhome'))
        app.use('/user/profile', require('../routers/user/userprofile')) // profile added
        app.use('/user/maintenance', require('../routers/user/maintenance'))
        app.use('/user/orders', require('../routers/user/order'))
        app.use('/materials', require('../routers/user/material/material'))
    }
    
    
    // pertner routes
    {
        app.use('/partner', require('../routers/partner/homepage'))
        app.use('/partner/profile',require('../routers/partner/partenerprofile')) // profile added
        app.use('/partner/addservices', require('../routers/partner/addservices'))
        app.use('/partner/orders', require('../routers/partner/order'))
        app.use('/partner/dashboard', require('../routers/partner/dashboard/dashboard'))
        app.use('/partner/dashboard/orders', require('../routers/partner/dashboard/orders'))
        app.use('/partner/dashboard/services', require('../routers/partner/dashboard/services'))
        app.use('/partner/dashboard/construction-materials', require('../routers/partner/dashboard/construction-materials'))

    }
    
    // admin routes 
    {
        app.use('/admin', require('../routers/admin/admin'))
        app.use('/admin/maintenance-services', require('../routers/admin/maintenance-sub-services'))
        app.use('/admin/dashboard/partners', require('../routers/admin/dashboard/partners'))
        app.use('/admin/dashboard/products', require('../routers/admin/dashboard/products'))
        app.use('/admin/dashboard/brands', require('../routers/admin/dashboard/brand'))
        app.use('/admin/dashboard/sizes', require('../routers/admin/dashboard/size'))
        app.use('/admin/dashboard/construction-material', require('../routers/admin/dashboard/construction-materials'))

    }
    
    
    // common routes
    {
        app.use('/products' ,require('../routers/products'))
        app.use('/login' ,require('../routers/login'))
        app.use('/signup', require('../routers/signup'))
        app.use('/reset-password', require('../routers/reset-password'))
        app.use('/', require('../routers/index'))
    }
    
    // "/contact" , "/logout"
    {
        app.use('/', require('../routers/common'))
    }
}