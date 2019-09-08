const express = require('express')
const Router = express.Router();
const swig = require('swig')
const path = require('path')
const partnerAuthMiddleware = require('../../../middlewares/partnerAuthMiddleware')
const { MaintenanceBooking } = require('../../../models/maintenance-booking')
const { BookingStatus } = require('../../../models/maintenance-booking')
const logger = require('debug')('User-orders:router')

// Partner DashBoard
//partner/dashboard/orders
Router.get('/', partnerAuthMiddleware, async (req, res) => {

    const partner = res.locals.partner;
    const maintenanceOrders = await MaintenanceBooking
        .find({ partner: partner._id }).sort('-date').deepPopulate('user partner services')
        .select();

    logger(maintenanceOrders)

    const template = swig.compileFile(path.join(__dirname, '/../../../html/partner/dashboard_html/orders.html'))
    res.send(template({
        locals: res.locals,
        maintenanceOrders: maintenanceOrders , 
        bookingStatuses : BookingStatus
    }))

})



module.exports = Router;