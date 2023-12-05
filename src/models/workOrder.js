const mongoose = require('mongoose');

// UniqueCodeState Schema
// const uniqueCodeStateSchema = new mongoose.Schema({
//   currentIndex: {
//     type: Number,
//     default: 0,
//   },
// });

// const UniqueCodeState = 
//   mongoose.models.UniqueCodeState || mongoose.model('UniqueCodeState', uniqueCodeStateSchema);

// Vendor Response Schema
const vendorResponseSchema = new mongoose.Schema({
  _id: String,
  vendorName: String,
  availability: {
    type: String,
    enum: ['In Stock', 'Out of Stock', 'Pending'],
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'N/A', 'Confirmed', 'Cancelled'],
    // required: true,
  },
  price: {
    type: Number,
    default: null,
  },
  delivery: {
    type: String,
    default: null,
  },
  partAvailable: {
    type: String,
    enum: ['yes', 'no', 'N/A', 'Pending'],
    // required: true,
  },
  code: {
    type: String,
    maxlength: 1 
  }
});

// Part Schema
const partSchema = new mongoose.Schema({
  partName: {
    type: String,
    required: true,
  },
  partNumber: {
    type: String,
    required: true,
  },
  selectedVendors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor', // Linking to my Vendor model
    },
  ],
  notificationsSent: {
    type: Date, // Stores the date when the notifications were sent
    default: null,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  vendorResponses: [vendorResponseSchema],
});

// Vehicle Schema
const vehicleSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: String,
  vin: String,
});

// Work Order Schema
const workOrderSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization ID is required'],
  },
  organizationName: {
    type: String,
    // required: [true, 'Organization Name is required'],
  },
  workOrderNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [
      'Awaiting Parts Manager Review',
      'Vehicle Details Added',
      'Parts and Vendors Updated',
      'Reviewed',
      'Vendor Notified',
    ],
    default: 'Awaiting Parts Manager Review',
    required: true,
  },
  mechanicName: {
    type: String,
    required: true,
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
  vehicle: vehicleSchema,
  selectedPart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Part',
    default: null,
  },
  parts: [partSchema],
});

const WorkOrder =
  mongoose.models.WorkOrder || mongoose.model('WorkOrder', workOrderSchema);

export default WorkOrder;
// export { UniqueCodeState };
