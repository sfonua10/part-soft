import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required!'],
  },
  profileImage: {
    type: String,
    default: null,  // or set to a default image URL if you have one
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
    default: 'mechanic'
  }
  // ... (other fields)
});

const User = models.User || model("User", UserSchema);

export default User;