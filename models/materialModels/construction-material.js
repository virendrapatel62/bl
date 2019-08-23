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
    brands: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'brand',
        require: true,
        default: []
    },
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
    subcategory: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'productType',
        required: false,
        default: []
    }
})

//Model
const constructionMaterial = mongoose.model('constructionMaterial', constructionMaterialSchema);

// get all product types

constructionMaterial.getAll = function () {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        const result = await constructionMaterial.find().select();
        resolve(result);
    })
}




var deepPopulate = require('mongoose-deep-populate')(mongoose);
constructionMaterialSchema.plugin(deepPopulate, {
    whitelist: [
        '[subcategory]'
    ]
});

module.exports = { constructionMaterial, constructionMaterialSchema }