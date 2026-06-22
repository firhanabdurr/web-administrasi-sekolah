const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  nis: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null },
  academic_year: { type: String, required: true },
  savings_balance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);