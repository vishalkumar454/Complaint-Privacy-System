import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const advocateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    specialization: {
      type: [String],
      required: [true, 'Specialization is required']
    },
    experience: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    casesHandled: {
      type: Number,
      default: 0
    },
    barCouncilId: {
      type: String,
      required: [true, 'Bar Council Registration ID is required'],
      unique: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      default: 'advocate'
    }
  },
  { timestamps: true }
);

advocateSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

advocateSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const Advocate = mongoose.model('Advocate', advocateSchema);
