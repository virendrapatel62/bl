const express = require('express');
const app = express();
const swig = require('swig')
const path = require('path')
const logger = require('debug')('index')
const winston = require('winston')
const config = require('config')


// for uncaughtException 
process.on('uncaughtException' , (ex)=>{
    console.log(ex);
    
    winston.error(ex.message , ex);
})

// logging setup 
winston.add(new winston.transports.File({filename : 'errorLog.log'}));

require('express-async-errors')

// Database connection 
require('./database/db')(app);

//middleware 
require('./startup/middleware')(app);

// for All routes..
require('./startup/routes')(app)
require('./startup/material-routes')(app)
require('./startup/APIroutes')(app)

// production middldewares
require('./startup/prod')(app);

// save states and cities
require('./startup/citystatecollection');

// error middle wares
app.use(require('./middlewares/error'));


// configuration
console.log(`email password :`  + config.get('email_password'));
console.log(`email :`  + config.get('email'));



// creating server
const PORT = process.env.PORT || 80;
console.log(PORT);

var reload = require('reload')
reload(app).then(function (reloadReturned) {

    app.listen(PORT, () => {
       logger(`Listening at port ${PORT}.....`);
        
       console.log(`Listening at port ${PORT}.....`);
        if (process.send) {
            process.send('online');
        }
    })// reloadReturned is documented in the returns API in the README

})



// async function test(){
//     const { User } = require('./models/user')
//     const result = await User.find({_id : '5d1f2d7985a99c7f8c8fa20d'}).select();
//     console.log(result);
    
// }

// test()
