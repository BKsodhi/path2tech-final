const User = require('../models/User');

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    
    next();
  } catch (err) {
    console.error('Admin Auth Error:', err.message);
    res.status(500).send('Server Error');
  }
};
