require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); // Keamanan tambahan untuk HTTP Headers

// Import Middlewares
const { applyMongoSanitize, apiLimiter, authLimiter } = require('./middlewares/security.middleware');
const { requireAuth } = require('./middlewares/auth.middleware');

const authRoutes = require('./routes/auth.route');
const studentRoutes = require('./routes/student.route');
const transactionRoutes = require('./routes/transaction.route');
const dashboardRoutes = require('./routes/dashboard.route');
const reportRoutes = require('./routes/report.route');

const app = express();

// --- 1. GLOBAL MIDDLEWARES ---
app.use(helmet());
app.use(cors());
app.use(express.json()); // Parsing JSON body
app.use(applyMongoSanitize()); // Cegah NoSQL Injection

// --- 2. KONEKSI DATABASE (REPLICA SET) ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Replica Set Terhubung!'))
  .catch(err => console.error('❌ Gagal koneksi MongoDB:', err));

// --- 3. ROUTES ---
// Route Auth pakai limiter khusus
app.use('/api/auth', authLimiter, authRoutes);

// Route API lainnya diproteksi JWT dan Limiter umum
app.use('/api/', apiLimiter, requireAuth);
app.use('/api/students', studentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// --- 4. START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});