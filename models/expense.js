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
  createdBy: {
    type: String,
    required: true, // Telegram username
  },
  participants: [{
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

// Add index for faster queries
ExpenseSchema.index({ createdBy: 1 });
ExpenseSchema.index({ 'participants.telegramUsername': 1 });

// Auto-update status when all participants have paid
ExpenseSchema.pre('save', function(next) {
  if (this.participants.every(p => p.paid) && this.status !== 'COMPLETED') {
    this.status = 'COMPLETED';
  }
  next();
});

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);