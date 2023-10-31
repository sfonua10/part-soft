import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization ID is required'],
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/ // regex to validate phone numbers
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/ // regex to validate email addresses
  },
  primaryContact: {
    type: String,
    required: true,
    trim: true
  },
  specialization: { 
    type: String,
    trim: true,
    default: ''
  }
  //... any other fields you need
});

// Check if the model is already registered to avoid overwriting
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);

export default Vendor;
