import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  description: String,
  creatorId: {
    type: Number,  // Telegram ID
    required: true
  },
  creatorWallet: {
    type: String,
    required: true
  },
  splits: [{
    telegramId: Number,
    amount: Number,
    paid: {
      type: Boolean,
      default: false
    },
    txHash: String
  }]
}, { timestamps: true });

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);