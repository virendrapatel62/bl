const express = require('express')
const app = express();
require('./models/city_state')
require('./models/coreservices')
const { MaintenanceBooking } = require('./models/maintenance-booking')
require('./models/partner')
require('./models/partner')
require('./models/partnerServices')
require('./models/maintenance-sub-services')
require('./models/subservices')
require('./models/user')



require('./database/db')(app)

const { Partner } = require('./models/partner')
const { User } = require('./models/user')


async function getNear() {
    const res = await PartnerService.find(
        {
            'geometry': {
                $geoNear: {
                    $geometry: {
                        type: "Point",
                        coordinates: [80.0521, 23.0958]
                    },
                    $maxDistance: 5000000,
                }
            }
        }
    ).populate('partner service')
}


async function test() {
    const { constructionMaterial } = require('./models/materialModels/construction-material');
    const { ProductCoreCategory } = require('./models/materialModels/product-core-category');
    const { ProductType } = require('./models/materialModels/product-type');
    const { Brand } = require('./models/materialModels/brand');
    // Brand.getAll()


    

}

test()
