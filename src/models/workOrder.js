const mongoose = require('mongoose');

// Vendor Response Schema
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

// Part Schema
const partSchema = new mongoose.Schema({
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

// Work Order Schema
const workOrderSchema = new mongoose.Schema({
    workOrderNumber: {
        type: String,
        required: true
    },
    parts: [partSchema]
});

const WorkOrder = mongoose.models.WorkOrder || mongoose.model('WorkOrder', workOrderSchema);

export default WorkOrder;
