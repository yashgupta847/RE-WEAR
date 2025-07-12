const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Swap = require('../../models/Swap');
const Item = require('../../models/Item');
const User = require('../../models/User');

// @route   POST api/swaps
// @desc    Create a new swap request
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('requestedItem', 'Requested item is required').not().isEmpty(),
      check('isPointsSwap', 'Swap type is required').isBoolean()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { requestedItem, offeredItem, isPointsSwap, message } = req.body;

      // Check if requested item exists and is available
      const itemRequested = await Item.findById(requestedItem);
      
      if (!itemRequested) {
        return res.status(404).json({ msg: 'Requested item not found' });
      }
      
      if (itemRequested.status !== 'approved') {
        return res.status(400).json({ msg: 'This item is not available for swapping' });
      }

      // Check if user is trying to swap their own item
      if (itemRequested.user.toString() === req.user.id) {
        return res.status(400).json({ msg: 'You cannot swap your own item' });
      }

      // For points swap
      if (isPointsSwap) {
        // Check if user has enough points
        const user = await User.findById(req.user.id);
        if (user.points < itemRequested.pointValue) {
          return res.status(400).json({ msg: 'Not enough points for this swap' });
        }

        // Create new swap
        const newSwap = new Swap({
          requester: req.user.id,
          owner: itemRequested.user,
          requestedItem,
          isPointsSwap: true,
          pointsAmount: itemRequested.pointValue
        });

        // Add initial message if provided
        if (message) {
          newSwap.messages.push({
            user: req.user.id,
            text: message
          });
        }

        const swap = await newSwap.save();

        res.json(swap);
      } 
      // For item swap
      else {
        // Check if offered item exists and belongs to requester
        if (!offeredItem) {
          return res.status(400).json({ msg: 'Offered item is required for item swaps' });
        }

        const itemOffered = await Item.findById(offeredItem);
        
        if (!itemOffered) {
          return res.status(404).json({ msg: 'Offered item not found' });
        }
        
        if (itemOffered.user.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'This is not your item to offer' });
        }
        
        if (itemOffered.status !== 'approved') {
          return res.status(400).json({ msg: 'Your offered item is not approved for swapping' });
        }

        // Create new swap
        const newSwap = new Swap({
          requester: req.user.id,
          owner: itemRequested.user,
          requestedItem,
          offeredItem,
          isPointsSwap: false
        });

        // Add initial message if provided
        if (message) {
          newSwap.messages.push({
            user: req.user.id,
            text: message
          });
        }

        const swap = await newSwap.save();

        res.json(swap);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/swaps
// @desc    Get all swaps for current user (both as requester and owner)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Find swaps where user is either requester or owner
    const swaps = await Swap.find({
      $or: [{ requester: req.user.id }, { owner: req.user.id }]
    })
      .sort({ date: -1 })
      .populate('requester', ['name', 'avatar'])
      .populate('owner', ['name', 'avatar'])
      .populate('requestedItem', ['title', 'images', 'pointValue'])
      .populate('offeredItem', ['title', 'images', 'pointValue']);

    res.json(swaps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/swaps/:id
// @desc    Get swap by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id)
      .populate('requester', ['name', 'avatar', 'location'])
      .populate('owner', ['name', 'avatar', 'location'])
      .populate('requestedItem')
      .populate('offeredItem');

    if (!swap) {
      return res.status(404).json({ msg: 'Swap not found' });
    }

    // Check if user is part of this swap
    if (
      swap.requester._id.toString() !== req.user.id &&
      swap.owner._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(swap);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Swap not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/swaps/:id/message
// @desc    Add message to swap
// @access  Private
router.post(
  '/:id/message',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const swap = await Swap.findById(req.params.id);

      if (!swap) {
        return res.status(404).json({ msg: 'Swap not found' });
      }

      // Check if user is part of this swap
      if (
        swap.requester.toString() !== req.user.id &&
        swap.owner.toString() !== req.user.id
      ) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      const newMessage = {
        user: req.user.id,
        text: req.body.text
      };

      swap.messages.unshift(newMessage);

      await swap.save();

      res.json(swap.messages);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Swap not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/swaps/:id/status
// @desc    Update swap status (accept, reject, complete, cancel)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ msg: 'Swap not found' });
    }

    // For accepting/rejecting, only the owner can do it
    if (['accepted', 'rejected'].includes(status) && 
        swap.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to accept/reject this swap' });
    }

    // For completing, only the owner can do it after it's been accepted
    if (status === 'completed' && 
        (swap.owner.toString() !== req.user.id || swap.status !== 'accepted')) {
      return res.status(401).json({ 
        msg: 'Not authorized to complete this swap or swap is not in accepted state' 
      });
    }

    // For cancelling, only the requester can do it if it's still pending
    if (status === 'cancelled' && 
        (swap.requester.toString() !== req.user.id || swap.status !== 'pending')) {
      return res.status(401).json({ 
        msg: 'Not authorized to cancel this swap or swap is not in pending state' 
      });
    }

    // Process the swap based on new status
    if (status === 'completed') {
      // Handle points transfer for points swap
      if (swap.isPointsSwap) {
        const owner = await User.findById(swap.owner);
        const requester = await User.findById(swap.requester);
        const requestedItem = await Item.findById(swap.requestedItem);

        // Transfer points from requester to owner
        requester.points -= swap.pointsAmount;
        owner.points += swap.pointsAmount;

        // Mark item as swapped
        requestedItem.status = 'swapped';

        await requester.save();
        await owner.save();
        await requestedItem.save();
      } 
      // Handle item swap
      else {
        const requestedItem = await Item.findById(swap.requestedItem);
        const offeredItem = await Item.findById(swap.offeredItem);

        // Mark both items as swapped
        requestedItem.status = 'swapped';
        offeredItem.status = 'swapped';

        await requestedItem.save();
        await offeredItem.save();
      }
    }

    // Update swap status
    swap.status = status;
    await swap.save();

    res.json(swap);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Swap not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;