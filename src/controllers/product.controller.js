const Product = require('../models/product.model');

const ProductCtrl =  {};

ProductCtrl.createProduct = async (req, res) => {
  try {
    const product = await new Product(req.body);
    const newProduct = await product.save();
    res.json(newProduct);
  } catch (error) {
    res.json(error);    
  }
};

ProductCtrl.getUserProducts = async (req, res) => {
  try {
    const product = await Product.find({userID: req.user._id});
    res.json(product);
  } catch (error) {
    res.json(error);
  }
};

ProductCtrl.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.json(error);
    }
};

ProductCtrl.getProductByID = async (req, res) => {
    try {
      const product = await Product.findOne({_id: req.params.id});
      res.json(product);
    } catch (error) {
      res.json(error);    
    }
};

ProductCtrl.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = {
        name: req.body.name,
        description: req.body.description
    };
    const updated = await Product.findOneAndUpdate({_id: id}, {$set: product}, {new: true});
    res.json(updated);
  } catch (error) {
    res.json(error);
  }
};

ProductCtrl.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findOneAndRemove({_id: id});
    res.json(`Fue eliminado exitosamente el registro ${id}`);
  } catch (error) {
    res.json(error);
  }
};

module.exports = ProductCtrl;