import mongoose from 'mongoose';

const chatbotLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null // Can be null if anonymous bot usage is allowed
    },
    prompt: {
      type: String,
      required: true
    },
    response: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const ChatbotLog = mongoose.model('ChatbotLog', chatbotLogSchema);
