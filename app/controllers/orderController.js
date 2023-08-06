const OrderRequest = require("../models/orderRequest");

const orderController = {
  getAllOrderRequests: async (req, res) => {
    try {
      const orderRequests = await OrderRequest.find().populate(
        "products.product"
      );
      res.json(orderRequests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getOrderRequestById: async (req, res) => {
    try {
      const orderRequest = await OrderRequest.findById(req.params.id).populate(
        "products.product"
      );
      if (!orderRequest) {
        return res.status(404).json({ error: "Order request not found" });
      }
      res.json(orderRequest);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  createOrderRequest: async (req, res) => {
    try {
      const { customerName, customerEmail, products, status } = req.body;
      const orderRequest = new OrderRequest({
        customerName,
        customerEmail,
        products,
        status,
      });
      await orderRequest.save();
      res.status(201).json(orderRequest);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateOrderRequest: async (req, res) => {
    try {
      const { customerName, customerEmail, products, status } = req.body;
      const updatedOrderRequest = await OrderRequest.findByIdAndUpdate(
        req.params.id,
        { customerName, customerEmail, products, status },
        { new: true }
      ).populate("products.product");
      if (!updatedOrderRequest) {
        return res.status(404).json({ error: "Order request not found" });
      }
      res.json(updatedOrderRequest);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteOrderRequest: async (req, res) => {
    try {
      const deletedOrderRequest = await OrderRequest.findByIdAndDelete(
        req.params.id
      );
      if (!deletedOrderRequest) {
        return res.status(404).json({ error: "Order request not found" });
      }
      res.json({ message: "Order request deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
module.exports = orderController;
