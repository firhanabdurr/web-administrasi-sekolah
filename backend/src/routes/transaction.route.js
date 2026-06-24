const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

const { requireAuth } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { apiLimiter } = require('../middlewares/security.middleware');

//req auth, rate limit aktif
router.use(apiLimiter);
router.use(requireAuth);

// Endpoint Tarik Tabungan (Hanya bisa diakses oleh TU dan Admin)
router.post(
  '/withdraw', 
  requireRole(['TU', 'Admin']), 
  transactionController.withdrawSavings
);

// Endpoint Update Master Kelas (Hanya bisa diakses oleh Admin)
router.put(
  '/class/:id', 
  requireRole(['Admin']), 
  transactionController.updateClassSpp
);

module.exports = router;