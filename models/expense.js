import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdById: {
    type: Number, // Telegram user ID is numeric
    required: true,
  },
  createdByUsername: {
    type: String,
    required: true,
  },
  creatorWallet: {
    type: String,
    required: true,
  },
  participants: [{
    telegramUsername: String,
    telegramId: Number, // Will be filled when they open payment link
    amount: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    walletAddress: String,
    txHash: String,
    paidAt: Date
  }],
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED'],
    default: 'PENDING'
  }
}, { timestamps: true });

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);