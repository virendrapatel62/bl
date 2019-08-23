const Router = require('express').Router();
const swig = require('swig')
const path = require('path')
const logger = require('debug')('products:Router')
const { ProductCoreCategory } = require('../../../models/materialModels/product-core-category');
const { Product } = require('../../../models/materialModels/product');
const { getConstructionMatearialTypes } = require('../../../models/materialModels/product-type');
const { constructionMaterial } = require('../../../models/materialModels/construction-material');
// admin/dashboard/construction-material/get-product-types


Router.get('/', async (req, res) => {
    const template = swig.compileFile(path.join(__dirname, '/../../../html/admin/construction-material.html'))
    res.send(template())
})

// get All Costruction material products 
Router.get('/getAll', async (req, res) => {

    // getting all construction materials 
    const {constructionMaterial}  =  require('../../../models/materialModels/construction-material')
    const result = await constructionMaterial.getAll();
    res.send(result)
})

// get All Costruction material products Populated 
Router.get('/getAll/populated', async (req, res) => {

    // getting all construction materials 
    const {constructionMaterial}  =  require('../../../models/materialModels/construction-material')
    const {Brand}  =  require('../../../models/materialModels/brand')
    const {ProductType}  =  require('../../../models/materialModels/product-type')
    const materials = await constructionMaterial.getAll();

    for(let m in materials){
        let brands = materials[m].brands;
        let subcategories = materials[m].subcategory;
        for(let b in brands){
            const x = await Brand.findOne({_id : brands[b]});
            brands[b] = x;
        }

        for(let b in subcategories){
            const x = await ProductType.findOne({_id : subcategories[b]});
            subcategories[b] = x;
        }
    }
    console.log(materials);
    
    res.send(materials)
})

// get All product type of specific product
Router.get('/get-product-types/:product', async (req, res) => {

    // getting all Product type / subcategory 
    const {ProductType}  =  require('../../../models/materialModels/product-type')
    const result = await ProductType.getProductTypeByProduct(req.params.product);
    res.send(result)
})


// get products of category
Router.get('/:category', async (req, res) => {

    const result = await Product.find({productCategory : req.params.category}).select();
    console.log(result);
    
    res.send(result)
})



// var multer = require('multer');
// var upload = multer({ dest: 'uploads/products/core_category' })
// // save-core-category
// Router.post('/save-core-category', upload.single('file'), async (req, res) => {
//     console.log(req.body);
//     const filepath = req.file.destination + "/" + req.file.filename;
//     console.log(filepath);
//     const category = new ProductCoreCategory({
//         title: req.body.title,
//         description: req.body.description,
//         image: filepath,
//     })

//     const result = await category.save();
//     logger(result);

//     res.send(result)

// })


//save product
//admin/dashboard/construction-material/save-product
var multer = require('multer');
var uploadProduct = multer({ dest: 'uploads/products/construction_materials' })
// save-core-category
Router.post('/save-product', uploadProduct.array('photos'), async (req, res) => {
    console.log((req.body));
    const body = req.body;
    const files = []
    for (var i in req.files) {
        var filepath = req.files[i].destination + "/" + req.files[i].filename;
        files.push(filepath)
    }
    console.log(files);

    const {constructionMaterial} = require('../../../models/materialModels/construction-material')
    
    if(!body.size){
        body.size = [];
    }
    
    const product = new constructionMaterial({
        name : body.name,
        description : body.description,
        unit : body.unit,
        size : body.size,
        images : files,
        varients : JSON.parse(req.body.varients) 
    })
    const result = await product.save();
    console.log(result);
    res.send(result)
    

})


// save consturction material types
//admin/dashboard/construction-material/save-product-type
var multer = require('multer');
var uploadProduct = multer({ dest: 'uploads/products/construction_materials/types' })
// save-core-category
Router.post('/save-product-type', uploadProduct.array('photos'), async (req, res) => {
    console.log(req.body);
    const body = req.body;
    const files = []
    for (var i in req.files) {
        var filepath = req.files[i].destination + "/" + req.files[i].filename;
        files.push(filepath)
    }
    console.log(files);

    const {constructionMaterial} = require('../../../models/materialModels/construction-material')
    const {ProductType} = require('../../../models/materialModels/product-type')
    
    const productcategory = await ProductCoreCategory.findOne({title : { $regex : /construction/i }}).select('_id');
    const productType = new ProductType({
        productCategory : productcategory._id , 
        images : files , 
        ...req.body
    })

    // saving prodcut type
    const productTypeSaveResult = await productType.save();
    console.log(productTypeSaveResult);
    
    // linking this product type to product

    const result = await constructionMaterial.updateOne(
        {_id : productTypeSaveResult.product} , 
        {
            $push : {
                subcategory : productTypeSaveResult._id 
            }
        } )
        
    console.log(result);
    res.send(
        {
            'productType' : productTypeSaveResult , 
            'productUpdate' : result  
        }
    )

})


// save brand
//admin/dashboard/construction-material/save-brand
var multer = require('multer');
var uploadProduct = multer({ dest: 'uploads/products/construction_materials/brands' })
// save-core-category
Router.post('/save-brand', uploadProduct.array('photos'), async (req, res) => {
    console.log(req.body);
    const body = req.body;
    const images = []
    for (var i in req.files) {
        var filepath = req.files[i].destination + "/" + req.files[i].filename;
        images.push(filepath)
    }
    console.log(images);


    const {constructionMaterial} = require('../../../models/materialModels/construction-material')
    const {Brand} = require('../../../models/materialModels/brand')
    
    const productcategory = await ProductCoreCategory.findOne({title : { $regex : /construction/i }}).select('_id');
    const brand = new Brand({
        productCategory : productcategory._id , 
        images,  // it will be images : images  
        ...req.body
    })

    // saving brand
    const brandSaveResult = await brand.save();
    console.log(brandSaveResult);
    
    // linking this brand to product

    const result = await constructionMaterial.updateOne(
        {_id : brandSaveResult.product} , 
        {
            $push : {
                brands : brandSaveResult._id 
            }
        } )
        
    console.log(result);
    res.send(
        {
            'brand' : brandSaveResult , 
            'productUpdate' : result  
        }
    )

})



module.exports = Router;