const express = require('express')
module.exports = function (app) {
    //login
    {
        app.use('/api/user/login', require('../routers/api/login'))
        app.use('/api/signup/user', require('../routers/api/signup'))
    }

    {
        app.use('/api/partner', require('../routers/api/partner'))
        app.use('/api/city', require('../routers/api/city'))
        app.use('/api/state', require('../routers/api/state'))
        app.use('/api/user', require('../routers/api/user'))
    }
    //services
    {
        app.use('/api/core-services', require('../routers/api/core-services'))
        app.use('/api/sub-services', require('../routers/api/sub-services'))
        app.use('/api/maintenance-services', require('../routers/api/maintenance-services'))
    }

    // material
    {
        app.use('/api/material/construction-material', require('../routers/api/materials/construction-material')) // construcction material 
        app.use('/api/material/size', require('../routers/api/materials/size'))
        app.use('/api/material/core-category', require('../routers/api/materials/core-category'))
        app.use('/api/material/products', require('../routers/api/materials/product'))
        app.use('/api/material/brands', require('../routers/api/materials/brand'))
        app.use('/api/material/product-types', require('../routers/api/materials/product-type'))
    }
}