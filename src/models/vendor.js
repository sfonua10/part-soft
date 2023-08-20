import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
  name: String,
  partAvailable: String,
  price: String,
  orderStatus: String,
  phone: String, // added fields
  email: String,
  primaryContact: String,
  //... any other fields you need
});

// Check if the model is already registered to avoid overwriting
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);

export default Vendor;
