const mongoose = require('mongoose')
// relation between partner and services
// {
//     partner : 'mohan', 
//     subservice : 'carpenter' , 
//     coreservice :'repaire and renovation'
// }

const partnerServices = new mongoose.Schema({

    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner"
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubServices"
    },
    coreService: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CoreServices"
    }
})


var deepPopulate = require('mongoose-deep-populate')(mongoose);
partnerServices.plugin(deepPopulate, {
    whitelist: [
        'partner', 'partner.city', 'partner.state', 'partner.location', 'coreService'
    ]
});

const PartnerService = mongoose.model('PartnerServices', partnerServices);
module.exports = { PartnerService, partnerServices }
