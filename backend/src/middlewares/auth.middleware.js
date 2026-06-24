const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Tempelkan payload token (biasanya id dan role) ke objek request
    // Biar Controller bisa tau siapa yang lagi login (req.user.id)
    req.user = decoded; 
    
    next(); 
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token kedaluwarsa. Silakan refresh token atau login ulang.' });
    }
    return res.status(403).json({ success: false, message: 'Token tidak valid.' });
  }
};

module.exports = { requireAuth };