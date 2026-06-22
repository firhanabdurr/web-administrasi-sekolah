const mongoose = require('mongoose');

const ClassSchema = {
  name: { type: String, required: true, unique: true },
  spp_amount: { type: Number, required: true } // Besaran SPP per bulan untuk kelas ini
  // timestamps: true
}

module.exports = mongoose.model('Class', ClassSchema);