const Router = require('express').Router();
const swig = require('swig')
const path = require('path')
const logger = require('debug')('products:Router')
const { ProductCoreCategory } = require('../../../models/materialModels/product-core-category');
const { Product } = require('../../../models/materialModels/product');
const { ProductType } = require('../../../models/materialModels/product-type');
// admin/dashboard/product-type

// save product-type
var multer = require('multer');
var uploadProduct = multer({ dest: 'uploads/products/product_type' })
// save-core-category
Router.post('/', uploadProduct.array('photos'), async (req, res) => {
    console.log(req.body);
    const files = []
    for (var i in req.files) {
        var filepath = req.files[i].destination + "/" + req.files[i].filename;
        files.push(filepath)
    }
    console.log(files);

    const productType = new ProductType({
        type : req.body.productType , 
        description : req.body.description, 
        productCategory : req.body.productCategory,
        product : req.body.product,
        images : files
    })

    const result =  await productType.save();
    logger('saveproduct' +  result);
    
    res.send(result);

})




module.exports = Router;