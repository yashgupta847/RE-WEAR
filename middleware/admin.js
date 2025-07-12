const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    // Get user from database
    const user = await User.findById(req.user.id);

    // Check if user is admin
    if (!user.isAdmin) {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};