import { Schema, model, models } from 'mongoose';
// Keep your vendorResponseSchema the same if it still applies
// const vendorResponseSchema = new mongoose.Schema({
//     _id: String,
//     vendorName: String,
//     availability: {
//         type: String,
//         enum: ['In Stock', 'Out of Stock', 'Pending'],
//         required: true
//     },
//     orderStatus: {
//         type: String,
//         enum: ['Pending', 'N/A', 'Confirmed', 'Cancelled'],
//         required: true
//     },
//     price: {
//         type: Number,
//         default: null,
//     },
//     delivery: {
//         type: String,
//         default: null
//     },
//     partAvailable: {
//         type: String,
//         enum: ['yes', 'no', 'N/A'],
//         required: true
//     }
// });

// Define a schema for individual parts
const partSchema = new Schema({
    partName: {
        type: String,
    },
    partNumber: {
        type: String,
    }
});

// Define a schema for vehicle information
const vehicleSchema = new Schema({
    make: String,
    model: String,
    year: String,
    vin: String,
});

// Adapt your partRequestSchema
const partRequestSchema = new Schema({
    workOrderNumber: {
        type: String,
        required: true
    },
    vehicle: vehicleSchema, // Reference the vehicleSchema here
    parts: [partSchema], // Now an array of parts
    // vendorResponses: [vendorResponseSchema] // Kept the same if still applicable
});

const PartRequest = models.PartRequest || model('PartRequest', partRequestSchema);

export default PartRequest;
