import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  totalAmount: Number,
  description: String,
  createdBy: Number,
  creatorWallet: String,
  participants: [{
    telegramUsername: String,
    amount: Number,
    paid: Boolean
  }]
}, { timestamps: true });

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);