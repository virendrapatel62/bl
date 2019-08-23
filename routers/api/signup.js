const express = require('express')
const Router = express.Router();
const { User, validateUser } = require('../../models/user');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const config = require('config');


Router.post('/', async (req, res) => {

    console.log('Signup User api' + JSON.stringify(req.body));
    const error = validateUser(req.body)
    if (!error) {
        console.log('Save User...');

        // cheaking user already exists or not 

        const isexists = await User.findOne({ email: req.body.email });
        if (isexists) {
            res.status(422).send('User Already Registered...')
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
        const token = jwt.sign(
            {
                user: result._id
            }
            , config.get('api_private_key'));

        res.send({
            user: result,
            token: token
        });


    } else {
        console.log(error.details[0].message);
        res.status(500).send(error.details[0].message)
    }
})



module.exports = Router;