const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderRequestSchema = new Schema({
    customerName: {
      type: String,
      required: true
    },
    customerEmail: {
      type: String,
      required: true
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'processed', 'shipped', 'delivered'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
const OrderRequest = mongoose.model('OrderRequest', orderRequestSchema);

module.exports = OrderRequest