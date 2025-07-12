const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Item = require('../../models/Item');
const User = require('../../models/User');

// @route   POST api/items
// @desc    Create a new item
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('condition', 'Condition is required').not().isEmpty(),
      check('size', 'Size is required').not().isEmpty(),
      check('images', 'At least one image is required').isArray({ min: 1 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        title,
        description,
        category,
        condition,
        size,
        gender,
        brand,
        images,
        pointValue
      } = req.body;

      // Create new item
      const newItem = new Item({
        user: req.user.id,
        title,
        description,
        category,
        condition,
        size,
        gender,
        brand,
        images,
        pointValue: pointValue || 50 // Default to 50 if not provided
      });

      const item = await newItem.save();

      res.json(item);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/items
// @desc    Get all approved items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const items = await Item.find({ status: 'approved' })
      .sort({ date: -1 })
      .populate('user', ['name', 'avatar']);
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/items/user
// @desc    Get current user's items
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort({ date: -1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/items/:id
// @desc    Get item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', [
      'name',
      'avatar',
      'location'
    ]);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    res.json(item);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/items/:id
// @desc    Delete an item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Check user
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
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

// @route   PUT api/items/:id
// @desc    Update an item
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Check user
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update fields
    const {
      title,
      description,
      category,
      condition,
      size,
      gender,
      brand,
      images,
      pointValue
    } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (condition) item.condition = condition;
    if (size) item.size = size;
    if (gender) item.gender = gender;
    if (brand) item.brand = brand;
    if (images && images.length > 0) item.images = images;
    if (pointValue) item.pointValue = pointValue;

    // If item was already approved and is being edited, set back to pending
    if (item.status === 'approved') {
      item.status = 'pending';
    }

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

module.exports = router;