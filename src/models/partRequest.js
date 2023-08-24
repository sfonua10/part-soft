const mongoose = require('mongoose');

const vendorResponseSchema = new mongoose.Schema({
    _id: String,
    vendorName: String,
    availability: {
        type: String,
        enum: ['In Stock', 'Out of Stock', 'Pending'],
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'N/A', 'Confirmed', 'Cancelled'],
        required: true
    },
    price: {
        type: Number,
        default: null,
    },
    delivery: {
        type: String,
        default: null
    },
    partAvailable: {
        type: String,
        enum: ['yes', 'no', 'N/A'],
        required: true
    }
});

const partRequestSchema = new mongoose.Schema({
    workOrderNumber: {
        type: String,
        required: true
    },
    partName: {
        type: String,
        required: true
    },
    partNumber: {
        type: String,
        required: true
    },
    make: String,
    model: String,
    year: String,
    vin: String,
    vendorResponses: [vendorResponseSchema]
});

const PartRequest = mongoose.model('PartRequest', partRequestSchema);

module.exports = PartRequest;