const Router = require('express').Router();
const { User } = require('../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const passwordHash = require('password-hash');

// validate the request body for user login
function loginValidation(user) {
    const Joi = require('joi')
    const schema = {
        email: Joi.string().max(30).min(5).required().email(),
        password: Joi.string().min(8).max(500).required(),
    }

    const result = Joi.validate(user, schema);
    return result.error;
}


// user login accepts { email , password }
Router.post('/', async (req, res) => {
    const body = req.body;
    const err = loginValidation(body);
    if (err) {
        res.status(422).send(err.details[0].message);
        return;
    }
    var flag = false;
    const result = await User.findOne({ email: body.email }).populate('city state').select();
    if (!result) {
        res.status(401).send("email or password invalid");
        return;
    } else {
        flag = passwordHash.verify(body.password, result.password)
    }

    if (flag) {
        const token = jwt.sign(
            {
                user: result._id
            }
            , config.get('api_private_key'));

        res.send({
            user: result,
            token: token
        });
    }

    else{
        res.status(401).send("email or password invalid");
        return;
    }

})


module.exports = Router