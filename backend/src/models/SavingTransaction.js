const mongoose = require('mongoose');

const savingsTransactionSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
  type: { type: String, enum: ['Deposit', 'Withdrawal'], required: true },
  amount: { type: Number, required: true },
  balance_after: { type: Number, required: true },
  handled_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('SavingsTransaction', savingsTransactionSchema);