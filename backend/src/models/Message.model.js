import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Ref can be dynamic based on role, but kept generic here or we can use refPath
    },
    senderModel: {
      type: String,
      required: true,
      enum: ['User', 'Advocate']
    },
    content: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);
