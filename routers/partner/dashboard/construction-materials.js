const express = require('express')
const Router = express.Router();
const swig = require('swig')
const path = require('path')
const logger = require('debug')('buildovo:partner:construction-materials');
const partnerAuthMiddleware = require('../../../middlewares/partnerAuthMiddleware');
const { Product } = require('../../../models/materialModels/products')
const { PartnerProduct } = require('../../../models/materialModels/partnerProduct')
const { ProductStock } = require('../../../models/materialModels/product-stock')
// /partner/dashboard/construction-materials

Router.get('/', partnerAuthMiddleware, async (req, res) => {
    const template = swig.compileFile(path.join(__dirname, "/../../../html/partner/dashboard_html/select_construction_materials.html"))
    const partner = req.session.partner

    // //getting partner's products // MRPS Objects
    // const partnerProductMrps = await PartnerProduct.find({ partner: partner }).select('mrp -_id');
    // const partnerProductMrpsArray = [];
    // logger(partnerProductMrps)
    // for (let i in partnerProductMrps) {
    //     partnerProductMrpsArray.push(partnerProductMrps[i].mrp);
    // }
    // logger({partnerProduct})
    const materials = await Product.getAll();
    // logger(partner)
    for (var m in materials) {
        const mrp = materials[m].MRP;
        for (n in mrp) {
            mrp[n].partnerProduct = await PartnerProduct.findOne({ mrp: mrp[n]._id , partner : partner }).populate('productStock').select();
        }
    }
    // console.log(materials);
    res.send(template(
        {
            partner: partner,
            constructionMaterial: materials,
            stockTypes: Product.stockTypes
            // partnerProduct : 
        }
    ));
})

// /partner/dashboard/construction-materials/save-or-update-partner-product

Router.post('/save-or-update-partner-product', partnerAuthMiddleware, async (req, res) => {
    console.log(req.body);
    const { product, mrp, prize, stockType } = req.body;
    const partner = req.session.partner._id;
    const productStock = new ProductStock({ product, partner });
    // creating object
    const partnerProduct = new PartnerProduct({
        product,
        mrp,
        prize,
        partner,
        productStock
    })
    var result = null;
    // if prize 0 delete oj=bject 
    if (new Number(prize) == 0) {
        result = await partnerProduct.deleteByPartnerProductAndMRP()
        res.send(result);
        console.log({ deleteResult: result });
        return;
    }
    // await PartnerProduct.deleteMany();
    const isExists = await partnerProduct.isExists();
    console.log({ isExists });
    if (isExists) {
        // true ==> update 
        result = await partnerProduct.updatePrizeByPartnerProductAndMRP();
        console.log({ update: result });
    } else {
        //save new 
        result = await partnerProduct.saveProduct(stockType);
        console.log({ save: result });
    }
    res.send(result);
})


// update-quantity
Router.post('/update-stock', partnerAuthMiddleware, async (req, res) => {
    console.log(req.body);
    const { product, mrp, quantity } = req.body;
    const partner = req.session.partner._id;
    const partnerProduct = new PartnerProduct({
        product,
        mrp,
        partner
    })
    var result = null;
    // await PartnerProduct.deleteMany();
    try {
        result = await partnerProduct.updateStock(quantity);
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error)
        return ;
    }

    res.send(result);
})




module.exports = Router;