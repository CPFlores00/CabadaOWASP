import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  firstName: {
    type: String,
    minlength: 1,
    maxlength: 25,
    required: true
  },
  lastName: {
    type: String,
    minlength: 1,
    maxlength: 35,
    required: true
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 70,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  meta: {
    logins: {
      type: Number,
      default: 0
    },
    encrypts: {
      type: Number,
      default: 0
    },
    decrypts: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: {
    createdAt: 'created_at'
  }
});

export default model('UserS', UserSchema);
