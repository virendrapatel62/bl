const express = require('express')
const swig = require('swig')
module.exports  = function(app){
    app.use(express.static('public'));
    app.engine('html', swig.renderFile);
    app.use(express.urlencoded())
    swig.setDefaults({ cache: false });
}