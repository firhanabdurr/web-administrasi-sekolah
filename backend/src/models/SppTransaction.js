const mongoose = require('mongoose');

const SppTransactionSchema = {
  student_id: { type: ObjectId, ref: 'Student', required: true, index: true },
  month: { type: Number, required: true }, // 1 - 12
  year: { type: Number, required: true }, 
  amount: { type: Number, required: true }, // Nominal yang dibayar (mengacu ke class.spp_amount saat itu)
  handled_by: { type: ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now, index: true }
}

// Compound Index krusial untuk mencegah double payment:
SppTransactionSchema.index({ student_id: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('SppTransaction', SppTransactionSchema);