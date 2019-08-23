const express = require('express')
const Router = express.Router();
const swig = require('swig')
const path = require('path')
const { User } = require('../../models/user');
const userAuthMiddleware = require('../../middlewares/userAuthMiddleware')
const { SubServices } = require('../../models/subservices')
const { CoreServices } = require('../../models/coreservices')
const { MaintenanceSubServices } = require('../../models/maintenance-sub-services')
const { PartnerService } = require('../../models/partnerServices')
const { MaintenanceBooking } = require('../../models/maintenance-booking')
const { BookingStatus } = require('../../models/maintenance-booking')
const logger = require('debug')('user:maintenance-router')
const geolib = require('geolib');

// /user/maintenance

Router.get('/', userAuthMiddleware, async (req, res) => {
    const template = swig.compileFile(path.join(__dirname, "/../../html/user/sub-maintenance-service.html"));
    const core = await CoreServices.findOne({ name: 'Maintenance' }).select();
    const services = await SubServices.find({ coreservice: core._id }).populate('coreservice').select();

    res.send(template({
        services: services,
        locals: res.locals
    }));
})

Router.get('/subservices/:maintenancServiceId', userAuthMiddleware, async (req, res) => {
    const serviceId = req.params.maintenancServiceId;
    const template = swig.compileFile(path.join(__dirname, "/../../html/user/sub-maintenance-service-subservices.html"));
    logger('Service Id :  ', serviceId)
    const core = await CoreServices.findOne({ name: 'Maintenance' }).select();
    const maintenanceServices = await SubServices.find({ coreservice: core._id }).populate('coreservice').select();
    // const services  = await MaintenanceSubServices.find({coreService : serviceId }).populate('coreService').select();
    // logger('Services : ' , services)
    res.send(template({
        locals: res.locals,
        serviceId: serviceId,
        coreServices: maintenanceServices
    }));
})
Router.get('/getsubservices/:maintenancServiceId', userAuthMiddleware, async (req, res) => {
    const serviceId = req.params.maintenancServiceId;
    const services = await MaintenanceSubServices.find({ coreService: serviceId }).populate('coreService').select();
    res.status(200).send(services);
})


Router.get('/service-providers/:subservice/:lat/:lng', userAuthMiddleware, async (req, res) => {
    const lat = req.params.lat;
    const lng = req.params.lng;
    const subservice = req.params.subservice;

    logger(__filename);
    logger(req.params);

    const template = swig.compileFile(path.join(__dirname, '/../../html/user/maintenance-service-providers.html'));
    res.send(template({
        locals: res.locals,
        lat: lat,
        lng: lng,
        subservice: subservice,
    }))
})



Router.get('/get-service-providers/:subservice/:lat/:lng', async (req, res) => {
    logger(req.originalUrl);
    const lat = req.params.lat;
    const lng = req.params.lng;
    const subservice = req.params.subservice;
    var serviceProviders = await PartnerService.find({ service: subservice })
        .deepPopulate('partner partner.city partner.state service coreService')
        .select();

    serviceProviders = await PartnerService.find(
        {
            'service': subservice,
            'geometry': {
                $geoNear: {
                    $geometry: {
                        type: "Point",
                        coordinates: [Number(lng), Number(lat)]
                    },
                    $maxDistance: 20000,
                }
            }
        }
    ).deepPopulate('partner partner.city partner.state service coreService')


    const result = eval(JSON.stringify(serviceProviders))
    for (var i in result) {
        const r = result[i];
        r.distance = (geolib.getDistance(r.geometry.coordinates, [lng, lat], 1)) / 1000

    }
    // logger(result);
    res.send(result)
})

// save cart to session 
Router.post('/save-cart', userAuthMiddleware, async (req, res) => {
    logger(__filename);
    logger(req.body);
    req.session.maintenanceCart = req.body;
    // res.send().status(505)
    res.send(req.session)
})

// serves the cart info page before confirm order
Router.get('/show-cart/:serviceProviderId', userAuthMiddleware, async (req, res) => {
    logger(__filename);
    const cart = req.session.maintenanceCart;
    var cartItems = cart.cartItems;
    logger(cartItems);
    logger(req.params.serviceProviderId);

    // adding service provider to cart object 
    // for future booking 
    cart.serviceProvider = req.params.serviceProviderId;
    var list = [];
    try {
        for (var i in cartItems) {
            logger(i);
            list.push(i);
        }
        var items = [];
        const cartDetails = await MaintenanceSubServices.find({
            _id: {
                $in: list
            }
        }).select();
        for (var i in cartDetails) {
            var c = cartDetails[i];
            var item = {};
            item.service = c;
            item.count = cartItems[c._id].count
            items.push(item)
        }
        cart.cartItems = items;
    } catch (error) {
        logger(error);
    }
    logger(cart);
    const template = swig.compileFile(path.join(__dirname, '/../../html/user/maintenance-cart-info.html'))
    res.send(template({
        locals: res.locals,
        cart: cart
    }))
})

// confirm order 
Router.post('/confirm-order', userAuthMiddleware, async (req, res) => {
    logger('====================confirm maintenance order===============');
    const body = req.body;
    // res.locaal fulls from user auth
    const user = res.locals.user;
    // stored cart in session of the user 
    const cart = req.session.maintenanceCart;

    // creating aarray of service and service details accoring to Schema of booking details 
    const servicearr = [];
    const serviceDetailsArray = [];
    for (var i in cart.cartItems) {
        var item = cart.cartItems[i];
        servicearr.push(item.service._id);
        serviceDetailsArray.push({
            service: item.service._id,
            serviceCharge: item.service.serviceCharge,
            quantity: item.count,
            total: item.count * item.service.serviceCharge
        });
    }

    logger('\nuser : ', user,
        '\ncart : ', cart,
        '\ncart items :  ', cart.cartItems,
        '\n Body : ', body,
        '\n service array : ', servicearr,
        '\n Service Details Array : ', serviceDetailsArray);

    // booking object 
    const booking = new MaintenanceBooking({
        partner: cart.serviceProvider,
        user: user,
        address: body.address,
        contact: body.contact,
        statusChangingDate: [{
            status: BookingStatus.pending,
            date: Date.now()
        }]
        ,
        totalServices: cart.totalItem,
        totalServiceCharge: cart.totalServiceCharge,
        bookingDetails: serviceDetailsArray,
        services: servicearr
    })

    const result = await booking.save();
    if (result) {
        logger('Save result : ', result);

        res.send(result).status(200)
    } else {
        res.send().status(500)
    }

})





module.exports = Router;