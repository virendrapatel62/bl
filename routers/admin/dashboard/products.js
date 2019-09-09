const Router = require('express').Router();
const swig = require('swig')
const path = require('path')
const logger = require('debug')('products:Router')
const { ProductCoreCategory } = require('../../../models/materialModels/product-core-category');
const { Product } = require('../../../models/materialModels/products');
// admin/dashboard/products


Router.get('/', async (req, res) => {
    const template = swig.compileFile(path.join(__dirname, '/../../../html/admin/products.html'))
    res.send(template())
})

// get products  of category
Router.get('/:category', async (req, res) => {

    const result = await Product.find({productCategory : req.params.category}).select();
    console.log(result);
    
    res.send(result)
})



var multer = require('multer');
var upload = multer({ dest: 'uploads/products/core_category' })
// save-core-category
Router.post('/save-core-category', upload.single('file'), async (req, res) => {
    console.log(req.body);
    const filepath = req.file.destination + "/" + req.file.filename;
    console.log(filepath);
    const category = new ProductCoreCategory({
        title: req.body.title,
        description: req.body.description,
        image: filepath,
    })

    const result = await category.save();
    logger(result);

    res.send(result)

})


// save product
var multer = require('multer');
var uploadProduct = multer({ dest: 'uploads/products/products' })
// save-core-category
Router.post('/save-product', uploadProduct.array('photos'), async (req, res) => {
    console.log(req.body);
    const files = []
    for (var i in req.files) {
        var filepath = req.files[i].destination + "/" + req.files[i].filename;
        files.push(filepath)
    }
    console.log(files);

    const product = new Product({
        title : req.body.title , 
        description : req.body.description, 
        productCategory : req.body.productCategory,
        images : files
    })

    const result =  await product.save();
    logger('saveproduct' +  result);
    
    res.send(result)

})




module.exports = Router;