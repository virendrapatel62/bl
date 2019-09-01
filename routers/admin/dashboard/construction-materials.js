const Router = require('express').Router();
const swig = require('swig')
const path = require('path')
const logger = require('debug')('products:Router')
const { ProductCoreCategory } = require('../../../models/materialModels/product-core-category');
const { Product } = require('../../../models/materialModels/product');
const { getConstructionMatearialTypes } = require('../../../models/materialModels/product-type');
const { ConstructionMaterial: constructionMaterial } = require('../../../models/materialModels/construction-material')
const { Brand } = require('../../../models/materialModels/brand')
const { Size } = require('../../../models/materialModels/size')
const { Varient } = require('../../../models/materialModels/varient')


const log = console.log;

// admin/dashboard/construction-material/get-product-types


// sends the page // contruction material.html
Router.get('/', async (req, res) => {
    const template = swig.compileFile(path.join(__dirname, '/../../../html/admin/construction-material.html'))
    const coreCategories = await ProductCoreCategory.getAll();
    //log(coreCategories);
    res.send(template(
        {
            coreCategories: coreCategories
        }
    ))
})

// get All Costruction material products 
Router.get('/getAll', async (req, res) => {
    // getting all construction materials 
    const { ConstructionMaterial: constructionMaterial } = require('../../../models/materialModels/construction-material')
    const result = await constructionMaterial.getAll();
    log(result);
    res.send(result)
})


// get All products of specific product Category
Router.get('/get-products-by-category/:category', async (req, res) => {
    const result = await constructionMaterial.getProductsByCategory(req.params.category);
    res.send(result)
})


// get All products of specific product Category
Router.get('/get-brands-by-product/:product', async (req, res) => {
    const result = await Brand.getByProduct(req.params.product);
    log(result);
    
    res.send(result)
})


// get products of category
Router.get('/:category', async (req, res) => {

    const result = await Product.find({ productCategory: req.params.category }).select();
    //log(result);

    res.send(result)
})



//save product
//admin/dashboard/construction-material/save-product
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/products/construction_materials')
    },
    filename: function (req, file, cb) {
        cb(null, `construction_material_date_${Date.now()}.png`)
    }
})
var uploadProduct = multer({dest : 'uploads/products/construction_materials'})
var uploadProduct = multer({storage : storage })
// save-core-category
Router.post('/save-product', uploadProduct.array('photos'), async (req, res) => {
    log((req.body));

    const body = req.body;
    const files = []
    for (var i in req.files) {

        var file = req.files[i];
        var filepath = `${file.destination}/${file.filename}.png`;
        files.push(filepath)
    }
    log(files);
    const { ConstructionMaterial: constructionMaterial } = require('../../../models/materialModels/construction-material')

    const product = new constructionMaterial({
        productName: body.name,
        description: body.description,
        images: files,
        productCategory: body.coreCategory
    })
    const result = await product.save();
    //log(result);
    res.send(result)
})



// save brand
//admin/dashboard/construction-material/save-brand
var multer = require('multer');
var uploadProduct = multer({dest : 'uploads/products/construction_materials/brands'})
var uploadProduct = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/products/construction_materials/brands')
        },
        filename: function (req, file, cb) {
            cb(null, `brands_date_${Date.now()}.png`)
        }
    })
})
// save-core-category
Router.post('/save-brand', uploadProduct.array('photos'), async (req, res) => {
    //log(req.body);
    const body = req.body;
    const images = []
    for (var i in req.files) {
        var file = req.files[i];
        var filepath =`${file.destination}/${file.filename}.png`;
        images.push(filepath)
    }
    log(images);
    log(body);

    const brand = new Brand({
        brand : body.title,
        description: body.description , 
        productCategory : body.productCategory ,
        product: body.product ,
        images,  // it will be images : images  
    })

    // saving brand
    const brandSaveResult = await brand.save();
    res.send(brandSaveResult)
})

// save size =========================================================================
 
var multer = require('multer');
var uploadVerient = multer({dest : 'uploads/products/construction_materials/sizes' })
var uploadVerient = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/products/construction_materials/sizes')
        },
        filename: function (req, file, cb) {
            cb(null, `sizes_date_${Date.now()}.png`)
        }
    })
})
Router.post('/save-product-size', uploadVerient.array('photos'), async (req, res) => {
    //log(req.body);
    const body = req.body;
    const images = []
    for (var i in req.files) {
        var file = req.files[i];
        var filepath =`${file.destination}/${file.filename}.png`;
        images.push(filepath)
    }
    log(images);
    log(body);

    var size = new Size({
        product : body.product , 
        size : body.size ,
        brand : (body.brand == '-1') ? undefined : body.brand , 
        description : body.description , 
        images
    })

    // saving brand
    const sizeSaveResult = await size.save();
    log(sizeSaveResult)
    res.send(sizeSaveResult)
})


// save verient =========================================================================

var multer = require('multer');
var uploadVerient = multer({dest : 'uploads/products/construction_materials/verients' })
var uploadVerient = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/products/construction_materials/verients')
        },
        filename: function (req, file, cb) {
            cb(null, `sizes_date_${Date.now()}.png`)
        }
    })
})
Router.post('/save-product-varient', uploadVerient.array('photos'), async (req, res) => {
    //log(req.body);
    const body = req.body;
    const images = []
    for (var i in req.files) {
        var file = req.files[i];
        var filepath =`${file.destination}/${file.filename}.png`;
        images.push(filepath)
    }
    log(images);
    log(body);
    var varient = new Varient({
        product : body.product , 
        varient : body.varient ,
        brand : (body.brand == '-1') ? undefined : body.brand , 
        description : body.description , 
        images
    })

    // saving brand
    const varientSaveResult = await varient.save();
    log(varientSaveResult)
    res.send(varientSaveResult)
})


module.exports = Router;