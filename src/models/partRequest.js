import { Schema, model, models } from 'mongoose';

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
