const { Product, Category } = require("../models/product");

const inventoryController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find().populate("category");
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate(
        "category"
      );
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  createProduct: async (req, res) => {
    try {
      const { name, category, price, quantity } = req.body;
      const product = new Product({ name, category, price, quantity });
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { name, category, price, quantity } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { name, category, price, quantity },
        { new: true }
      ).populate("category");
      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  createCategory: async (req, res) => {
    try {
      const { name, description } = req.body;
      const category = new Category({ name, description });
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name, description } = req.body;
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { name, description },
        { new: true }
      );
      if (!updatedCategory) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteCategory: async(req, res) =>{
    try {
      const deletedCategory = await Category.findByIdAndDelete(req.params.id);
      if (!deletedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = inventoryController;