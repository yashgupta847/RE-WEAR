const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const Item = require('../../models/Item');
const User = require('../../models/User');
const Swap = require('../../models/Swap');

// @route   GET api/admin/items/pending
// @desc    Get all pending items
// @access  Private/Admin
router.get('/items/pending', [auth, admin], async (req, res) => {
  try {
    const items = await Item.find({ status: 'pending' })
      .sort({ date: -1 })
      .populate('user', ['name', 'email']);
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/admin/items/:id/approve
// @desc    Approve an item
// @access  Private/Admin
router.put('/items/:id/approve', [auth, admin], async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    if (item.status !== 'pending') {
      return res.status(400).json({ msg: 'Item is not in pending status' });
    }

    item.status = 'approved';
    await item.save();

    res.json(item);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/admin/items/:id/reject
// @desc    Reject an item
// @access  Private/Admin
router.put('/items/:id/reject', [auth, admin], async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    if (item.status !== 'pending') {
      return res.status(400).json({ msg: 'Item is not in pending status' });
    }

    item.status = 'rejected';
    await item.save();

    res.json(item);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', [auth, admin], async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ date: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/admin/users/:id/admin
// @desc    Toggle admin status for a user
// @access  Private/Admin
router.put('/users/:id/admin', [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Toggle admin status
    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/stats
// @desc    Get platform statistics
// @access  Private/Admin
router.get('/stats', [auth, admin], async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const itemCount = await Item.countDocuments();
    const pendingItemCount = await Item.countDocuments({ status: 'pending' });
    const approvedItemCount = await Item.countDocuments({ status: 'approved' });
    const swappedItemCount = await Item.countDocuments({ status: 'swapped' });
    const swapCount = await Swap.countDocuments();
    const completedSwapCount = await Swap.countDocuments({ status: 'completed' });

    res.json({
      users: userCount,
      items: {
        total: itemCount,
        pending: pendingItemCount,
        approved: approvedItemCount,
        swapped: swappedItemCount
      },
      swaps: {
        total: swapCount,
        completed: completedSwapCount
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/admin/items/:id
// @desc    Delete an item (admin override)
// @access  Private/Admin
router.delete('/items/:id', [auth, admin], async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    await item.remove();

    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;