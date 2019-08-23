const mongoose = require('mongoose')
const { ProductCoreCategory } = require('../materialModels/product-core-category')

const ProductTypeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    }
    ,
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productCoreCategory',
        require: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        require: true
    }
})

const ProductType = mongoose.model('productType', ProductTypeSchema);


// get all product types
async function getAll() {
    const result = await ProductType.find().select();
    return result
}
// get only of Construction material
function getConstructionMatearialTypes() {
    return new Promise(async (resolve, reject) => {
        const core = await ProductCoreCategory.find().select();
        const result = await ProductType.find({ productCategory: core._id }).select();
        // console.log(result);

        resolve(result)
    })


}


// get types by product

ProductType.getProductTypeByProduct = function (product) {
    return new Promise(async (resolve, reject) => {
        console.log("ProductType.getProductTypeByProduct");
        var result = await ProductType.find({ product });
        console.log(result);
        resolve(result);
    })
}

module.exports = {
    ProductTypeSchema,
    ProductType,
    getConstructionMatearialTypes,
    getAll
}