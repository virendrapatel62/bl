const express = require('express')
const app = express();
require('../models/city_state')
require('../models/coreservices')
require('../models/maintenance-booking')
require('../models/maintenance-sub-services')
require('../models/partner')
require('../models/partnerServices')
require('../models/subservices')
require('../models/user')
const { constructionMaterial } = require('../models/materialModels/construction-material');
const { ProductCoreCategory } = require('../models/materialModels/product-core-category');
const { ProductType } = require('../models/materialModels/product-type');
const { Brand } = require('../models/materialModels/brand');
const { Size } = require('../models/materialModels/size');
const { Varient } = require('../models/materialModels/varient');
const { MRP } = require('../models/materialModels/mrp');
const faker = require('faker');


require('../database/db')(app)


async function SaveProduct() {
    for (var i = 0; i < 20; i++) {
        const productName = faker.commerce.productName();
        const description = faker.lorem.paragraph();
        const mrp = []
        const res = await new constructionMaterial({
            productName,
            description,
            mrp
        }).save();
        console.log(res);
    }
}


async function SaveBrands() {
    const construction = await constructionMaterial.find();
    for (var i = 0; i < 20; i++) {
        var brand = faker.company.companyName();
        const brandObj = new Brand({
            product: construction[i],
            brand
        })
        const res = await brandObj.save();
        console.log(res);
    }
}



async function saveSizes() {
    const construction = await constructionMaterial.find();
    const brands = await Brand.find();
    for (var i = 0; i < construction.length; i++) {
        const sizeObj = new Size({
            product: construction[i],
            brand: brands[i],
            size: new String(faker.random.number())

        })
        const res = await sizeObj.save();
        console.log(res);
    }
}
async function saveVarient() {
    const construction = await constructionMaterial.find();
    const brands = await Brand.find();
    for (var i = 0; i < construction.length; i++) {

        const radomNumber = faker.random.number(19);
        const radomNumber2 = faker.random.number(19);
        var units = ["KG", "MM", "CM", "piece"]
        const varient = new Varient({
            product: construction[radomNumber],
            brand: brands[radomNumber2],
            varient: new String(faker.random.number(25) + " " + units[faker.random.number(4)])
        })
        const res = await varient.save();
        console.log(res);
    }
}

async function saveMRP() {
    const construction = await constructionMaterial.find();
    const brands = await Brand.find();
    const varients = await Varient.find();
    const sizes = await Size.find();
    for (var i = 0; i < construction.length; i++) {

        const brandRandom = faker.random.number(19);
        const sizeRandom = faker.random.number(19);
        const varientRandom = faker.random.number(19);
        const productRandom = faker.random.number(19);
        const mrp = new MRP({
            product: construction[productRandom],
            brand: brands[brandRandom],
            varient: varients[varientRandom],
            size: sizes[sizeRandom],
            MRP: faker.random.number(1000)
        })
        var saveMrp = await mrp.save();
        console.log(saveMrp);
        res = await constructionMaterial.updateMany({ _id: construction[productRandom] }, {
            $push: {
                MRP: mrp._id
            }
        })
        console.log(res);
    }
}
async function saveFakeDate() {
    console.log(await constructionMaterial.deleteMany({}),
        await Size.deleteMany({}),
        await Varient.deleteMany({}),
        await MRP.deleteMany({}),
        await Brand.deleteMany({})
    );
    await SaveProduct();
    await SaveBrands()
    await saveSizes()
    await saveVarient()
    await saveMRP();
}

async function getData() {
    const result = await constructionMaterial.find()
        .populate({
            path: 'MRP',
            model: 'mrp',
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
        })
        .select('MRP')
    for (var i in result) {
        for (var j in result[i].MRP)
            console.log(result[i].MRP[j]);

    }

}


getData();