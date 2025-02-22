import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
  avatar: String,
  bio: String,
  location: String,
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  },
}, {
  timestamps: true,
});

export const User = mongoose.model('User', userSchema); 