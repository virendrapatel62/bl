const mongoose = require('mongoose')
const { CollectionNames } = require('../../constants/collection-names')

// Schema of the model
const productStockSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: CollectionNames.PRODUCTS
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: CollectionNames.PARTNER
    },
    stock: {
        type: Number,
        required: false,
        default: 0
    }
})



// Model Class
const ProductStock = mongoose.model('productStock', productStockSchema);

ProductStock.prototype.isExists = function () {
    return new Promise(async (resolve, reject) => {
        const res = await ProductStock.findOne({ product: this.product._id, partner: this.partner }).select();
        console.log({ product_Id: this.product._id });
        console.log({ res });

        resolve(res);
    })
}


// Exporting Schema and Model
module.exports = { ProductStock }