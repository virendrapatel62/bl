const mongoose = require('mongoose')
const { MRP } = require('./mrp');
const { Size } = require('./size');
const { Varient } = require('./varient');
const { Brand } = require('./brand');

// schema
const constructionMaterialSchema = new mongoose.Schema({
    productName: {
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
        required: false
    },
    MRP: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mrp',
        required: true,
        default: []
    }],
    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productCoreCategory',
        require: false
    },
})

//Model
const ConstructionMaterial = mongoose.model('constructionMaterial', constructionMaterialSchema);
//===============================================================================

// get Product By Category
ConstructionMaterial.getProductsByCategory = function (category) {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        const result = await ConstructionMaterial
            .find(
                {
                    productCategory : category
                }
            )
            .populate(
                [
                    {
                        path: 'MRP',
                        model: 'mrp',
                        //populating brands , varint , sizes
                        populate: [
                            {
                                path: 'brand',
                                model: 'brand'
                            },
                            {
                                path: 'varient',
                                model: 'varient',
                            },
                            {
                                path: 'size',
                                model: 'size',
                            }
                        ]
                    },
                    {
                        path: 'productCategory',
                        model: 'productCoreCategory'
                    }
                ]
            );
        resolve(result);
    })
}

// get all product types
ConstructionMaterial.getAll = function () {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        const result = await ConstructionMaterial
            .find()
            .populate(
                [
                    {
                        path: 'MRP',
                        model: 'mrp',
                        //populating brands , varint , sizes
                        populate: [
                            {
                                path: 'brand',
                                model: 'brand'
                            },
                            {
                                path: 'varient',
                                model: 'varient',
                            },
                            {
                                path: 'size',
                                model: 'size',
                            }
                        ]
                    },
                    {
                        path: 'productCategory',
                        model: 'productCoreCategory'
                    }
                ]
            );
        resolve(result);
    })
}


// get product By Id
ConstructionMaterial.getById = function (id) {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        const result = await ConstructionMaterial.findOne({ _id: id })
            .populate(
                {
                    path: 'MRP',
                    model: 'mrp',
                    //populating brands , varint , sizes
                    populate: [
                        {
                            path: 'brand',
                            model: 'brand'
                        },
                        {
                            path: 'varient',
                            model: 'varient',
                        },
                        {
                            path: 'size',
                            model: 'size',
                        }
                    ]
                }
            );
        resolve(result);
    })
}


// get all Name  ( Abstract name)
ConstructionMaterial.getByName = function (name) {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        const result = await ConstructionMaterial.find({
            productName: {
                $regex: new RegExp(name, 'i')
            }
        }).populate(
            {
                path: 'MRP',
                model: 'mrp',
                //populating brands , varint , sizes
                populate: [
                    {
                        path: 'brand',
                        model: 'brand'
                    },
                    {
                        path: 'varient',
                        model: 'varient',
                    },
                    {
                        path: 'size',
                        model: 'size',
                    }
                ]
            }
        )
        resolve(result);
    })
}


// get by Size  
ConstructionMaterial.getBySize = function (size) {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        const result = await Size
            .find({ size: size })
            .populate(
                [
                    // populating product 
                    {
                        path: 'product',
                        model: 'constructionMaterial',
                        // pupulating mrps
                        populate: {
                            path: 'MRP',
                            model: 'mrp',
                            //populating brands , varint , sizes
                            populate: [
                                {
                                    path: 'brand',
                                    model: 'brand'
                                },
                                {
                                    path: 'varient',
                                    model: 'varient'
                                },
                                {
                                    path: 'size',
                                    model: 'size'
                                }
                            ]
                        }

                    },
                ]
            )
            .select('product')
        resolve(result);
    })
}


// get by brand ID
ConstructionMaterial.getByBrand = function (_id) {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        const result = await Brand
            .find({ _id })
            .populate(
                [
                    // populating product 
                    {
                        path: 'product',
                        model: 'constructionMaterial',
                        // pupulating mrps
                        populate: {
                            path: 'MRP',
                            model: 'mrp',
                            //populating brands , varint , sizes
                            populate: [
                                {
                                    path: 'brand',
                                    model: 'brand'
                                },
                                {
                                    path: 'varient',
                                    model: 'varient'
                                },
                                {
                                    path: 'size',
                                    model: 'size'
                                }
                            ]
                        }

                    },
                ]
            )
            .select('product')
        resolve(result);
    })
}




//=======================================================================
var deepPopulate = require('mongoose-deep-populate')(mongoose);
constructionMaterialSchema.plugin(deepPopulate, {
    whitelist: [
        'MRP',
        'MRP.brand',
        'MRP.size',
        'MRP.varient',
    ]
});

module.exports = {ConstructionMaterial, constructionMaterialSchema }