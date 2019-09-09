const mongoose = require('mongoose')
const { MRP } = require('./mrp');
const { Size } = require('./size');
const { Varient } = require('./varient');
const { Brand } = require('./brand');
const { CollectionNames } = require('./../../constants/collection-names');


const stockTypes = {
    SINGLE : 'single' , 
    MULTIPLE : 'multiple'
}

Object.freeze(stockTypes)


// schema
const productSchema = new mongoose.Schema({
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
        ref: CollectionNames.MRP,
        required: true,
        default: []
    }],
    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: CollectionNames.PRODUCT_CORE_CATEGORY,
        require: false
    },
    productStockType: {
        type: String,
        enum: [
            stockTypes.SINGLE,
            stockTypes.MULTIPLE
        ],
        default: stockTypes.MULTIPLE,
        required: true
    }
})

//Model
const Product = mongoose.model(CollectionNames.PRODUCTS, productSchema);
Product.stockTypes = stockTypes
//===============================================================================

// get Product By Category
Product.getProductsByCategory = function (category) {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        const result = await Product
            .find(
                {
                    productCategory: category
                }
            )
            .populate(
                [
                    {
                        path: 'MRP',
                        model: CollectionNames.MRP,
                        //populating brands , varint , sizes
                        populate: [
                            {
                                path: 'brand',
                                model: CollectionNames.BRAND
                            },
                            {
                                path: 'varient',
                                model: CollectionNames.VARIENT,
                            },
                            {
                                path: 'size',
                                model: CollectionNames.SIZE,
                            }
                        ]
                    },
                    {
                        path: 'productCategory',
                        model: CollectionNames.PRODUCT_CORE_CATEGORY
                    }
                ]
            );
        resolve(result);
    })
}

// get all product types
Product.getAll = function () {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        try {
            const result = await Product
                .find()
                .populate(
                    [
                        {
                            path: 'MRP',
                            model: CollectionNames.MRP,
                            //populating brands , varint , sizes
                            populate: [
                                {
                                    path: 'brand',
                                    model: CollectionNames.BRAND
                                },
                                {
                                    path: 'varient',
                                    model: CollectionNames.VARIENT,
                                },
                                {
                                    path: 'size',
                                    model: CollectionNames.size,
                                }
                            ]
                        },
                        {
                            path: 'productCategory',
                            model: CollectionNames.PRODUCT_CORE_CATEGORY
                        }
                    ]
                );
            console.log('Model');

            resolve(result);
        } catch (error) {
            reject(error)
        }
    })
}


// get product By Id
Product.getById = function (id) {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        try {
            const result = await Product.findOne({ _id: id })
                .populate(
                    {
                        path: 'MRP',
                        model: CollectionNames.MRP,
                        //populating brands , varint , sizes
                        populate: [
                            {
                                path: 'brand',
                                model: CollectionNames.BRAND
                            },
                            {
                                path: 'varient',
                                model: CollectionNames.VARIENT
                            },
                            {
                                path: 'size',
                                model: CollectionNames.SIZE,
                            }
                        ]
                    }
                );
            resolve(result);
        } catch (error) {
            reject(error)
        }
    })
}


// get all Name  ( Abstract name)
Product.getByName = function (name) {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        try {
            const result = await Product.find({
                productName: {
                    $regex: new RegExp(name, 'i')
                }
            }).populate(
                {
                    path: 'MRP',
                    model: CollectionNames.MRP,
                    //populating brands , varint , sizes
                    populate: [
                        {
                            path: 'brand',
                            model: CollectionNames.BRAND
                        },
                        {
                            path: 'varient',
                            model: CollectionNames.VARIENT,
                        },
                        {
                            path: 'size',
                            model: CollectionNames.SIZE,
                        }
                    ]
                }
            )
            resolve(result);
        } catch (error) {
            reject(error)
        }
    })
}


// get by Size  
Product.getBySize = function (size) {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        try {
            const result = await Size
                .find({ size: size })
                .populate(
                    [
                        // populating product 
                        {
                            path: 'MRP',
                            model: CollectionNames.MRP,
                            //populating brands , varint , sizes
                            populate: [
                                {
                                    path: 'brand',
                                    model: CollectionNames.BRAND
                                },
                                {
                                    path: 'varient',
                                    model: CollectionNames.VARIENT,
                                },
                                {
                                    path: 'size',
                                    model: CollectionNames.SIZE,
                                }
                            ]


                        },
                    ]
                )
                .select('product')
            resolve(result);
        } catch (error) {
            reject(error)
        }
    })
}


// get by brand ID
Product.getByBrand = function (_id) {
    // returning a promish
    return new Promise(async (resolve, reject) => {
        try {
            const result = await Brand
                .find({ _id })
                .populate(
                    [
                        // populating product 
                        {
                            path: 'MRP',
                            model: CollectionNames.MRP,
                            //populating brands , varint , sizes
                            populate: [
                                {
                                    path: 'brand',
                                    model: CollectionNames.BRAND
                                },
                                {
                                    path: 'varient',
                                    model: CollectionNames.VARIENT,
                                },
                                {
                                    path: 'size',
                                    model: CollectionNames.SIZE,
                                }
                            ]

                        },
                    ]
                )
                .select('product')
            resolve(result);
        } catch (error) {
            reject(error)
        }
    })
}





module.exports = { Product, productSchema }