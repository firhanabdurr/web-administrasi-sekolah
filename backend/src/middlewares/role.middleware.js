const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ success: false, message: 'Identitas tidak valid.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Akses dilarang. Halaman ini hanya untuk: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};

module.exports = { requireRole };