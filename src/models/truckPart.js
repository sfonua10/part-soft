import mongoose from 'mongoose';

const TruckPartSchema = new mongoose.Schema({
    workOrderNumber: {
        type: String,
        required: true
    },
    partName: {
        type: String,
        required: true
    },
    vendorName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    price: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['Ordered', 'Received', 'Cancelled', 'Returned'], // Example statuses, modify as needed
        required: true
    },
    requestPart: String, 
    repairOrderNumber: String,
    make: String,
    model: String,
    vin: String,
    pictures: [String] // Assuming URLs or paths to the images
});

// Check if the model is already registered to avoid overwriting
const TruckPart = mongoose.models.TruckPart || mongoose.model('TruckPart', TruckPartSchema);

export default TruckPart;
