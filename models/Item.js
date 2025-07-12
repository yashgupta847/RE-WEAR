const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Footwear', 'Other']
  },
  condition: {
    type: String,
    required: true,
    enum: ['New with tags', 'Like new', 'Good', 'Fair', 'Poor']
  },
  size: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex', 'Kids']
  },
  brand: {
    type: String
  },
  images: [
    {
      type: String,
      required: true
    }
  ],
  pointValue: {
    type: Number,
    required: true,
    default: 50
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected', 'swapped']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('item', ItemSchema);