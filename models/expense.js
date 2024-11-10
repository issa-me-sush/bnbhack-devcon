import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  creatorId: Number,
  walletAddress: String,
  participantIds: [Number]
}, { timestamps: true });

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);