import mongoose from 'mongoose';

const ParticipantSchema = new mongoose.Schema({
  telegramUsername: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  walletAddress: {
    type: String,
  },
  txHash: {
    type: String,
  },
  paidAt: {
    type: Date,
  },
});

export default ParticipantSchema;