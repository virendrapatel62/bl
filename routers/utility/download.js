const Router = require('express').Router();

Router.get('/', (req, res) => {
    // query = img
    console.log(req.query);

    res.download(req.query.img)

})

module.exports = Router;