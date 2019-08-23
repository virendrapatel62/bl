const express = require('express')
const Router = express.Router();
const swig = require('swig')
const path = require('path')

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


// user/orders/....

// get All Orders of user - maintenance orders
Router.get('/', userAuthMiddleware, async (req, res) => {

    const user = res.locals.user;
    const maintenanceOrder = await MaintenanceBooking
        .find({ user: user._id }).sort('-date').deepPopulate('user partner services')
        .select();

    // logger(maintenanceOrder[0].bookingDetails)

    const template = swig.compileFile(path.join(__dirname, '/../../html/user/orders.html'))
    res.send(template({
        locals: res.locals,
        maintenanceOrders: maintenanceOrder
    }))

})

// get Order full information
Router.get('/maintenance-orders/order-info/:orderid', userAuthMiddleware, async (req, res) => {
    const orderid = req.params.orderid;
    const orderDetails = await MaintenanceBooking
        .findById({ _id: orderid })
        .deepPopulate('user partner services bookingDetails.service')
        .select();
    logger(orderDetails)
    res.send(orderDetails).status(200);
})


// mark completed the mantenance order 
Router.get('/maintenance-orders/mark-completed/:orderid', userAuthMiddleware, async (req, res) => {
    const orderid = req.params.orderid;
    const updateResult = await MaintenanceBooking
        .updateOne(
            { _id: orderid },
            {
                $set: {
                    bookingStatus: BookingStatus.completed,

                },
                $push: {
                    statusChangingDate: {
                        status: BookingStatus.completed,
                        date: Date.now()
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

                },
                $push: {
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