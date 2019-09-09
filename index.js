const express = require('express');
const app = express();
const swig = require('swig')
const path = require('path')
const logger = require('debug')('index')
const winston = require('winston')
const config = require('config')

// for printing the request info
app.use(function (req, res, next) {

    if(req.url.includes('css') 
    || req.url.includes('js') 
    || req.url.includes('customcss') 
    || req.url.includes('customjs') 
    || req.url.includes('js') 
    || req.url.includes('png') 
    || req.url.includes('jpg')){

    }else{

        console.log(`Url : ${req.url} , Body : ${req.method}` );
    }
    next()
    // return;
})


// for uncaughtException 
process.on('uncaughtException', (ex) => {
    console.log(ex);

    winston.error(ex.message, ex);
})

// logging setup 
winston.add(new winston.transports.File({ filename: 'errorLog.log' }));

require('express-async-errors')

// Database connection 
require('./database/db')(app);

//middleware 
require('./startup/middleware')(app);

// for All routes..
require('./startup/routes')(app)
require('./startup/APIroutes')(app)

// production middldewares
require('./startup/prod')(app);

// save states and cities
require('./startup/citystatecollection');

// swig filters
require('./startup/swigFilter')(swig);

// error middle wares
app.use(require('./middlewares/error'));


// configuration
console.log(`email password :` + config.get('email_password'));
console.log(`email :` + config.get('email'));



// creating server
const PORT = process.env.PORT || 80;
console.log(PORT);

var reload = require('reload')
let server = null;

server = app.listen(PORT, () => {
    logger(`Listening at port ${PORT}.....`);
})
// reload(app).then(function (reloadReturned) {
//     server = app.listen(PORT, () => {
//        logger(`Listening at port ${PORT}.....`);

//        console.log(`Listening at port ${PORT}.....`);
//         if (process.send) {
//             process.send('online');
//         }
//     })// reloadReturned is documented in the returns API in the README

// })


module.exports = server