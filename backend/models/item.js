// backend/models/item.js

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true 
  },
  type: {
    type: String,
    required: true,
    enum: ['book', 'movie']
  },
  title: {
    type: String,
    required: true
  },
  authors: {
    type: [String], 
    required: true
  },
  year: String,
  description: String,
  poster: String,
});

module.exports = mongoose.model('Item', itemSchema);