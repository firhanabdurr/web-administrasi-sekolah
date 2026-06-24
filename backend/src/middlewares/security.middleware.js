const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Limiter khusus untuk endpoint login (Mencegah brute-force password)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Maksimal 5x percobaan per IP
  message: { success: false, message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter umum untuk API transaksi (Mencegah spam API)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 60, // Maksimal 60 request per menit per IP
  message: { success: false, message: 'Trafik terlalu tinggi. Mohon tunggu sebentar.' }
});

// Sanitizer dieksekusi di level Express App (app.js)
const applyMongoSanitize = () => mongoSanitize({
  replaceWith: '_', // Mengganti karakter '$' dan '.' dengan '_'
});

module.exports = { authLimiter, apiLimiter, applyMongoSanitize };