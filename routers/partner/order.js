const express = require('express')
const Router = express.Router();
const swig = require('swig')
const path = require('path')
const partnerAuthMiddleware = require('../../middlewares/partnerAuthMiddleware')
const userAuthMiddleware = require('../../middlewares/userAuthMiddleware')
const { User } = require('../../models/user');
const { SubServices } = require('../../models/subservices')
const { CoreServices } = require('../../models/coreservices')
const { MaintenanceSubServices } = require('../../models/maintenance-sub-services')
const { PartnerService } = require('../../models/partnerServices')
const { MaintenanceBooking } = require('../../models/maintenance-booking')
const { BookingStatus } = require('../../models/maintenance-booking')
const logger = require('debug')('User-orders:router')
const geolib = require('geolib');


// partner/orders/....

// get All Orders of Partner - maintenance orders
Router.get('/', partnerAuthMiddleware, async (req, res) => {

    const partner = res.locals.partner;
    const maintenanceOrders = await MaintenanceBooking
        .find({ partner: partner._id }).sort('-date').deepPopulate('user partner services')
        .select();

    logger(maintenanceOrders)

    const template = swig.compileFile(path.join(__dirname, '/../../html/partner/orders.html'))
    res.send(template({
        locals: res.locals,
        maintenanceOrders: maintenanceOrders , 
        bookingStatuses : BookingStatus
    }))

})

// mark Confirmed the mantenance order 
Router.get('/maintenance-orders/approve/:orderid', partnerAuthMiddleware, async (req, res) => {
    const orderid = req.params.orderid;
    const updateResult = await MaintenanceBooking
        .updateOne(
            { _id: orderid },
            {
                $set: {
                    bookingStatus: BookingStatus.confirmed,
                } , 
                $push : {
                    statusChangingDate :{
                        status : BookingStatus.confirmed , 
                        date : Date.now()
                    }
                }
            }
        )
    logger(updateResult)
    res.send(updateResult).status(200);
})


// cancel the mantenance order 
Router.post('/maintenance-orders/cancel/:orderid', userAuthMiddleware, async (req, res) => {
    const orderid = req.params.orderid;
    const reason = req.body.reason;
    const updateResult = await MaintenanceBooking
        .updateOne(
            { _id: orderid },
            {
                $set: {
                    cancelationReason: reason,
                    bookingStatus: BookingStatus.canceled,
                    statusChangingDate: {
                        status: BookingStatus.canceled,
                        date: Date.now()
                    }
                }
            }
        )
    logger(updateResult)
    res.send(updateResult).status(200);
})




module.exports = Router;