const mongoose = require('mongoose')
const logger = require('debug')('Db.js : ')

module.exports = function(app){
    const url = 'mongodb+srv://vidly:1234@cluster0-e9dlq.mongodb.net/test?retryWrites=true&w=majority';
    const local = "mongodb://localhost/buildovo";
    mongoose.connect(url  , async function(err , database){
        // var r = await database.collections.partnerservices.getIndexes();
        // database.collections.partners.dropIndex('locat_2dsphere') ;
        // delete r.location_2dsphere;
        //  console.log(r);
         console.log(err);
        
         database.collections.partners.createIndex( { location : "2dsphere" });
        database.collections.partnerservices.createIndex( { 'geometry' : "2dsphere" });
        
    })
    

    // session setting

    // session Setting
    const session = require('express-session');
    const MongoStore = require('connect-mongo')(session);
    
    app.use(session({
        secret: 'musecretkey',
        store: new MongoStore({mongooseConnection : mongoose.connection }),
        autoRemove: 'interval',
        cookie : {expires : 1000 * 60 * 60 *24} , 
        autoRemoveInterval: 5 , 
    }));
}