const mongoose = require('mongoose')


// schema
const constructionMaterialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
    ,
    description: {
        type: String,
        required: true
    },
    brands: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand',
        require: true,
        default: []
    }],
    size: {
        type: [String],
        required: false,
    },
    varients: [{
        varient: String,
        mrp: Number,
        size: String
    }],
    unit: {
        type: String,
        required: false
    },
    images: {
        type: [String],
        required: true
    },
    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productCoreCategory',
        require: false
    },
    subcategory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productType',
        required: false,
        default: []
    }]
})

//Model
const constructionMaterial = mongoose.model('constructionMaterial', constructionMaterialSchema);

// get all product types
constructionMaterial.getAll = function () {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        const result = await constructionMaterial.find().deepPopulate('subcategory brands').select();
        resolve(result);
    })
}


// get product By Id
constructionMaterial.getById = function (id) {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        const result = await constructionMaterial.findById(id).deepPopulate('subcategory brands');
        resolve(result);
    })
}
// get all Name  ( Abstract name)
constructionMaterial.getByName = function (name) {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        const result = await constructionMaterial.find({
            name: {
                $regex: new RegExp(name, 'i')
            }
        })
        resolve(result);
    })
}
// get by Size  
constructionMaterial.getBySize = function (size) {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        const result = await constructionMaterial.find({
            size: {
                $in: size
            }
        }).deepPopulate('subcategory brands').select();
        resolve(result);
    })
}

// get by SubCategory  
constructionMaterial.getBySubCategory = function (subCat) {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        const result = await constructionMaterial
            .findOne()
            .where(
                {
                    subcategory: subCat
                }
            )
            .deepPopulate('subcategory brands').select()

        resolve(result);
    })
}





var deepPopulate = require('mongoose-deep-populate')(mongoose);
constructionMaterialSchema.plugin(deepPopulate, {
    whitelist: [
        'subcategory',
        'brands'
    ]
});

module.exports = { constructionMaterial, constructionMaterialSchema }