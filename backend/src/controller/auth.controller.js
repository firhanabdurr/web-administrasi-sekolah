const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); //

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Kredensial tidak valid atau akun nonaktif' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Kredensial tidak valid' });
    }

    const payload = {
      id: user._id,
      role: user.role,
      name: user.name
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      token,
      user: payload
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};