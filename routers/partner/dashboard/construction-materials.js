const express = require('express')
const Router = express.Router();
const swig = require('swig')
const path = require('path')
const partnerAuthMiddleware = require('../../../middlewares/partnerAuthMiddleware');
const { ConstructionMaterial } = require('../../../models/materialModels/construction-material')
const { PartnerProduct } = require('../../../models/materialModels/partnerProduct')
// /partner/dashboard/construction-materials

Router.get('/', partnerAuthMiddleware, async (req, res) => {
    const template = swig.compileFile(path.join(__dirname, "/../../../html/partner/dashboard_html/select_construction_materials.html"))
    const partner = req.body.partner
    const materials = await ConstructionMaterial.getAll();

    for (var m in materials) {
        const mrp = materials[m].MRP;
        for (n in mrp) {
            mrp[n].partnerProduct = await PartnerProduct.findOne({ mrp: mrp[n]._id }).select('prize');
            if (mrp[n].partnerProduct) {
                console.log(mrp[n].partnerProduct.prize);

            }
        }
    }
    // console.log(materials);
    res.send(template(
        {
            partner: partner,
            constructionMaterial: materials
        }
    ));
})

// /partner/dashboard/construction-materials/save-or-update-partner-product

Router.post('/save-or-update-partner-product', partnerAuthMiddleware, async (req, res) => {
    console.log(req.body);
    const { product, mrp, prize } = req.body;
    const partner = req.session.partner._id;
    const partnerProduct = new PartnerProduct({
        product,
        mrp,
        prize,
        partner
    })
    var result = null;

    // if prize 0 delete oj=bject 
    if (new Number(prize) == 0) {
        result = await PartnerProduct.deleteMany(
            {
                product,
                mrp,
                partner
            }
        );
        res.send(result);
        return;
    }


    // await PartnerProduct.deleteMany();
    const isExists = await partnerProduct.isExists();
    console.log(isExists);





    if (isExists) {
        // true ==> update 
        result = await PartnerProduct.updateOne(
            {
                product,
                mrp,
                partner
            },
            {
                $set: {
                    prize
                }
            }
        );
        console.log(result.ok);

    } else {
        //save new 
        result = await partnerProduct.save();

    }
    res.send(result);
})




module.exports = Router;