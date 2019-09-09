const Router = require('express').Router();
const swig = require('swig')
const path = require('path')
const logger = require('debug')('products:Router')
const { ProductCoreCategory } = require('../../../models/materialModels/product-core-category');
const { Product } = require('../../../models/materialModels/products');
const { Brand } = require('../../../models/materialModels/brand')
const { Size } = require('../../../models/materialModels/size')
const { Varient } = require('../../../models/materialModels/varient')
const { MRP } = require('../../../models/materialModels/mrp')
const { PartnerProduct } = require('../../../models/materialModels/partnerProduct')
const AdminAuthMiddleware = require('../../../middlewares/adminAuthMiddleware')


const log = console.log;

// admin/dashboard/construction-material/


// sends the page // contruction material.html
Router.get('/',AdminAuthMiddleware ,  async (req, res) => {
    const template = swig.compileFile(path.join(__dirname, '/../../../html/admin/construction-material.html'))
    res.send(template(
        {
            coreCategories: await ProductCoreCategory.getAll() , 
            stockTypes : Product.stockTypes
        }
    ))
})

// get All Costruction material products 
Router.get('/getAll',AdminAuthMiddleware ,  async (req, res) => {
    // getting all construction materials 
    res.send(await Product.getAll())
})


// get All products of specific product Category
Router.get('/get-products-by-category/:category',AdminAuthMiddleware ,  async (req, res) => {
    res.send(await Product.getProductsByCategory(req.params.category))
})


// get All products of specific product Category
Router.get('/get-brands-by-product/:product',AdminAuthMiddleware , async (req, res) => {
    res.send(await Brand.getByProduct(req.params.product))
})

// get All products of specific product Category
Router.get('/get-brands-sizes-varients-by-product/:product', AdminAuthMiddleware , async (req, res) => {
    res.send({
        brands: await Brand.getByProduct(req.params.product),
        varients: await Varient.getByProduct(req.params.product),
        sizes: await Size.getByProduct(req.params.product)
    })
})

// get All sizes and  varients using  brand id 
Router.get('/get-sizes-varients-by-brand/:brand', AdminAuthMiddleware , async (req, res) => {
    res.send(
        {
            varients: await Varient.getByBrand(req.params.brand),
            sizes: await Size.getByBrand(req.params.brand)
        }
    )
})

// get products of category
Router.get('/:category', AdminAuthMiddleware , async (req, res) => {
    res.send(await Product.find({ productCategory: req.params.category }).select())
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
var uploadProduct = multer({ dest: 'uploads/products/construction_materials' })
var uploadProduct = multer({ storage: storage })
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

    const product = new Product({
        productName: body.name,
        description: body.description,
        stockType: body.stockType,
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
var uploadProduct = multer({ dest: 'uploads/products/construction_materials/brands' })
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
        var filepath = `${file.destination}/${file.filename}.png`;
        images.push(filepath)
    }
    log(images);
    log(body);

    const brand = new Brand({
        brand: body.title,
        description: body.description,
        productCategory: body.productCategory,
        product: body.product,
        images,  // it will be images : images  
    })

    // saving brand
    const brandSaveResult = await brand.save();
    res.send(brandSaveResult)
})

// save size =========================================================================

var multer = require('multer');
var uploadVerient = multer({ dest: 'uploads/products/construction_materials/sizes' })
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
        var filepath = `${file.destination}/${file.filename}.png`;
        images.push(filepath)
    }
    log(images);
    log(body);

    var size = new Size({
        product: body.product,
        size: body.size,
        brand: (body.brand == '-1') ? undefined : body.brand,
        description: body.description,
        images
    })

    // saving brand
    const sizeSaveResult = await size.save();
    log(sizeSaveResult)
    res.send(sizeSaveResult)
})


// save verient =========================================================================

var multer = require('multer');
var uploadVerient = multer({ dest: 'uploads/products/construction_materials/verients' })
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
        var filepath = `${file.destination}/${file.filename}.png`;
        images.push(filepath)
    }
    log(images);
    log(body);
    var varient = new Varient({
        product: body.product,
        varient: body.varient,
        brand: (body.brand == '-1') ? undefined : body.brand,
        description: body.description,
        images
    })

    // saving brand
    const varientSaveResult = await varient.save();
    log(varientSaveResult)
    res.send(varientSaveResult)
})



// save Mrps
Router.post('/save-mrp',AdminAuthMiddleware ,  async (req, res) => {
    log('save MRP')
    log(req.body)
    if (!req.body.product || req.body.product == '-1') {
        res.status(500).send('Select Product');
        return;
    }

    if (!req.body.brand || req.body.brand == '-1') {
        req.body.brand = undefined;
    }


    if (!req.body.varient || req.body.varient == '-1') {
        req.body.varient = undefined;
    }

    if (!req.body.size || req.body.size == '-1') {
        req.body.size = undefined;
    }

    if (!req.body.mrp || req.body.mrp == '') {
        res.status(500).send('Enter Mrp');
        return;
    }

    const {brand , varient , product , mrp , size } = req.body;
    const obj = new  MRP({
        brand , 
        varient , 
        product , 
        size , 
        MRP : mrp 
    })

    const result = await obj.save();

    // push mrp to product

    var productId = result.product ;
    const update  = await Product.updateOne({_id : productId} , {
            $push : {
                MRP : result._id
            }
    }) 

    log({result , update })
    res.send(result);
})


module.exports = Router;