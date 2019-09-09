const express = require('express')
const Router = express.Router();
const swig = require('swig')
const path = require('path')
const userAuthMiddleware = require('../../../middlewares/userAuthMiddleware')
const { User } = require('../../../models/user');
const { ProductCoreCategory } = require('../../../models/materialModels/product-core-category');
const { Product } = require('../../../models/materialModels/products');
const logger = require('debug')('User-orders:router')


// materials/....

Router.get('/', async (req, res) => {
    console.log("material");
    const categories = [];

    const category = await ProductCoreCategory.find().select();
    for (i in category) {
        var products = await Product.find({ productCategory: category[i]._id }).select();
        var obj = {};
        obj.category = category[i];
        obj.products = products;
        console.log(products);

        categories.push(obj)
    }
    res.send(
        swig.compileFile(path.join(__dirname, "../../../html/material/books.html"))(
            {
                locals: res.locals,
                categories: categories
            }
        )
    );

})

module.exports = Router;