import mongoose from 'mongoose';
import { encryptField, decryptField } from '../utils/encryption.js';

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      default: () => `CMP-${Date.now()}`
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      get: decryptField,
      set: encryptField
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      get: decryptField,
      set: encryptField
    },
    category: {
      type: String,
      enum: ['Harassment', 'Fraud', 'Cybercrime', 'Civil Rights', 'Other'],
      required: true
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function() { return !this.isAnonymous; }
    },
    assignedAdvocate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Advocate',
      default: null
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'In Progress', 'Resolved', 'Closed'],
      default: 'Pending'
    },
    evidenceFiles: [
      {
        url: String,
        filename: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    createdDate: {
      type: Date,
      default: Date.now
    }
  },
  { 
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
);

export const Complaint = mongoose.model('Complaint', complaintSchema);
