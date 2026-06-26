const mongoose = require('mongoose');

const UserSchema = {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'TU'], required: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true }
  // timestamps: true (Otomatis nambah createdAt & updatedAt)
}

module.exports = mongoose.model('User', UserSchema);

