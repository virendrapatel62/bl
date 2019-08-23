const express = require('express')
const Router = express.Router();
const swig = require('swig')
const path = require('path')
const { getAddresses } = require('./utility/requestSender');
const { City } = require('../models/city_state');
const { State } = require('../models/city_state');
const { User } = require('../models/user');
const { Partner } = require('../models/partner');
const  passwordHash= require('password-hash');



// show signup page
Router.get('/', async (req, res) => {
    const template = swig.compileFile(path.join(__dirname, "../html/user_signuppage.html"))
    const cities = await City.find().sort('name').select();
    for (i in cities) {
        cities[i].id = cities._id;
    }
    const states = await State.find().sort('name').select();
    for (i in states) {
        states[i].id = states._id;
    }
    res.send(template({
        cities: cities,
        states: states
    }));
})

// getAddresses for suggetions
Router.get('/getaddresses/:query', async (req, res) => {
    const result = await getAddresses(req.params.query);
    
    res.send(result)
})

Router.post('/', async (req, res) => {
    const { validateUser } = require('../models/user');

    console.log('Signup User' + JSON.stringify(req.body));
    const error = validateUser(req.body)
    if (!error) {
        console.log('Save User...');

        // cheaking user already exists or not 

        const isexists = await User.findOne({ email: req.body.email });
        if (isexists) {
            res.status(500).send('User Already Registered...')
            return;
        }

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: passwordHash.generate(req.body.password),
            contact: req.body.contact,
            lat: req.body.lat,
            lng: req.body.lng,
            city: req.body.city,
            state: req.body.state,
            address: req.body.address
        })
        const result = await user.save();
        res.send();


    } else {
        console.log(error.details[0].message);
        res.status(500).send(error.details[0].message)
    }





})


// signup  for Partners 
// serves the paernner signup page
Router.get('/joinusaspartner', async (req, res) => {
    const template = swig.compileFile(path.join(__dirname, "../html/partner/signuppage.html"));

    const cities = await City.find().sort('name').select();
    for (i in cities) {
        cities[i].id = cities._id;
    }
    const states = await State.find().sort('name').select();
    for (i in states) {
        states[i].id = states._id;
    }
    res.send(template({
        cities: cities,
        states: states
    }));

})


// validate partner 
Router.post('/partner/validate',  async(req, res) => {
    console.log("validating Partner....");
    console.log(`body in Validator signup ${JSON.stringify(req.body)}`);
    const { validatePartner } = require('../models/partner');
    const error = validatePartner(req.body);
    if (error) {
        res.status(500).send(error.details[0].message);
    } else {
        // validation already register or no t
        const isalrdy = await Partner.findOne({ email: req.body.email }).select();
        console.log(isalrdy);
        
        if (isalrdy) {
            res.status(500).send("email already registered..");
            return ;
        }else{
            res.send()
        }
        
    }
})


// signup parner 
var multer  = require('multer');
var upload = multer({ dest: 'uploads/idproofs'})
Router.post('/partner', upload.single('idproof') ,  async (req, res) => {
    console.log("Registring partner....");
    console.log(`Registring partner....${req.file}`);
    console.log(`Registring partner....${JSON.stringify(req.file)}`);
    console.log(`Registring partner....${req.file.destination}`);
    const u = req.body;
    console.log(`body in partner signup ${JSON.stringify(req.body)}`);
    const partner = new Partner({
        name: u.username,
        email: u.email,
        password: passwordHash.generate(u.password),
        city: u.city,
        state: u.state,
        address: u.address,
        contact: u.contact,
        location: {
            type: "Point",
            coordinates: [u.lng, u.lat]
        },
        idproof: {
            path : req.file.path, 
            filename: req.file.filename
        }
    })
    const result = await partner.save();
    console.log(result);
    
    const template = swig.compileFile(path.join(__dirname + "/../html/index.html"))
    res.send(template())

})



module.exports = Router;