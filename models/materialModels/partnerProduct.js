const mongoose = require('mongoose')
const { CollectionNames } = require('../../constants/collection-names')
const { Product } = require('./products')
const { ProductStock } = require('./product-stock')




// Schema of the model
const partnerProductSchema = new mongoose.Schema({
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: CollectionNames.PARTNER,
        required: true,
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: CollectionNames.PRODUCTS,
        require: true
    },
    prize: {
        type: Number,
        required: true,
        default: 0
    },
    mrp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: CollectionNames.MRP,
        require: true
    },
    productStock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: CollectionNames.PRODUCT_STOCK,
        required: true
    }

})



// Model Class
const PartnerProduct = mongoose.model(CollectionNames.PARTNER_PRODUCT, partnerProductSchema);

PartnerProduct.prototype.saveProduct = function (stockType) {
    return new Promise(async (resolve, reject) => {
        console.log(stockType);
        var saveResult = "";
        console.log({ stockType });
        if (stockType == Product.stockTypes.MULTIPLE) {
            this.productStock.save();
            saveResult = await this.save();
        } else if (stockType == Product.stockTypes.SINGLE) {

            // in this case multiple PartnerProduct Has Same Stock Object 
            // cheaking is there any existing object in stock 
            // if yes that object refrence will be save in this object 
            // if no save new Stock Object 
            console.log('MUltiple Product Stock .....');
            const productStock = await this.productStock.isExists();

            console.log({ productStock });

            if (productStock) {
                this.productStock = productStock;
            } else {
                this.productStock.save();
            }

            saveResult = await this.save();

            resolve()
            return;

        }
        // console.log(saveResult);

        resolve(saveResult)

    })
}


PartnerProduct.prototype.isExists = function () {
    return new Promise(async (resolve, reject) => {
        const count = await PartnerProduct.find({
            mrp: this.mrp,
            product: this.product,
            partner: this.partner
        }).count();

        resolve(count > 0 ? true : false);
    })

}

PartnerProduct.prototype.updateStock = function (stock) {
    return new Promise(async (resolve, reject) => {

        const obj = await PartnerProduct.findOne({
            mrp: this.mrp,
            product: this.product,
            partner: this.partner
        }).populate('productStock').select('productStock')

        if (obj) {
            console.log({ Stock: obj });
            obj.productStock.stock = stock
            const update = await ProductStock.updateOne({ _id: obj.productStock._id }, obj.productStock)
            resolve(update);
        }else{
            reject("Enter Prize First..")
        }
    })

}

// delete Many 

PartnerProduct.prototype.deleteByPartnerProductAndMRP = function () {
    return new Promise(async (resolve, reject) => {
        result = await PartnerProduct.deleteMany(
            {
                partner: this.product,
                mrp: this.mrp,
                partner: this.partner
            }
        );
        resolve(result)
    })
}


// Update Many 

PartnerProduct.prototype.updatePrizeByPartnerProductAndMRP = function () {
    return new Promise(async (resolve, reject) => {
        result = await PartnerProduct.updateMany(
            {
                product: this.product,
                mrp: this.mrp,
                partner: this.partner
            },
            {
                $set: {
                    prize: this.prize
                }
            }
        );
        resolve(result)
    })
}

// Exporting Schema and Model
module.exports = { PartnerProduct, partnerProductSchema }