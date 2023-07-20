const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const categorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  // Create models
  const Product = mongoose.model('Product', productSchema);
  const Category = mongoose.model('Category', categorySchema);
  

  module.exports = {Product, Category}