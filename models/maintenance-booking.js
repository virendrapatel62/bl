const mongoose = require('mongoose')
const { Partner } = require('./partner')

const BookingStatus = {
    pending: 'Pending',
    canceled: 'Canceled',
    confirmed: 'Confirmed',
    completed: 'Completed'
}
const BookingStatusArray = [BookingStatus.pending, BookingStatus.canceled, BookingStatus.completed, BookingStatus.confirmed]


const bookingDetailSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaintenanceServices',
        required: true
    },
    serviceCharge: {
        type: Number,
        required: true,
        default: 0
    },
    quantity: Number,
    total: Number
})

const maintenanceBookingSchema = new mongoose.Schema({
    bookingStatus: {
        type: String,
        enum: BookingStatusArray,
        required: true,
        default: 'Pending'
    },
    cancelationReason: String,
    date: {
        type: Date,
        default: Date.now(),
        required: true
    }
    ,
    address: {
        type: String,
        required: true,
    },
    contact: {
        type: String
    },
    statusChangingDate: {
        type: [new mongoose.Schema({
            status: {
                type: String,
                enum: BookingStatusArray
            },
            date: {
                type: Date,
                default: Date.now()
            }
        })], 
        default : []
    },
    endDate: {
        type: Date
    },
    startDate: {
        type: Date
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalServices: Number,
    totalServiceCharge: Number,
    bookingDetails: {
        type: [bookingDetailSchema],
        required: true,
        validate: {
            validator: function (value) {
                if (!value || value.length == 0) {
                    return false
                } else {
                    return true
                }
            },
            message: 'services are required for bokking...'
        }
    },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceServices' }]
})


var deepPopulate = require('mongoose-deep-populate')(mongoose);
maintenanceBookingSchema.plugin(deepPopulate, {
    whitelist: [
        'user', 'partner', 'user.city', 'user.state', 'services', 'partner.city', 'bookingDetails.service'
    ]
});



const MaintenanceBooking = mongoose.model('MaintenanceBooking', maintenanceBookingSchema);


module.exports = { MaintenanceBooking, maintenanceBookingSchema, BookingStatus }