import { Schema, model, models } from 'mongoose'
const mongoose = require('mongoose')

const UserSchema = new Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    default: null,
    index: true
  },
  organizationName: {
    type: String,
    default: null, // or set to a default value if you have one
  },
  name: {
    type: String,
    default: null,
    index: true
  },
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required!'],
  },
  image: {
    type: String,
    default: null, // or set to a default image URL if you have one
  },
  companyName: {
    type: String,
    // required: [true, 'Company Name is required!'],
  },
  password: {
    type: String,
    // required: [true, 'Password is required!'],
  },
  role: {
    type: String,
    default: 'mechanic',
    index: true
  },
  // ... (other fields)
})

const User = models.User || model('User', UserSchema)

export default User
