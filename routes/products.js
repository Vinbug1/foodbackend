const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const { Product } = require('../models/product');
const { Category } = require('../models/category');
const { Restaurant } = require('../models/restaurant');

const router = express.Router();

// Define the allowed file types and their extensions
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

// Configure the multer storage options
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

// Get all products
router.get('/', async (req, res) => {
    try {
        const productList = await Product.find().populate('restaurant');
        res.status(200).send(productList);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('restaurant');
        if (!product) {
            res.status(404).send('Product not found');
        }
        res.send(product);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Create a new product
router.post('/', uploadOptions.single('image'), async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        const restaurant = await Restaurant.findById(req.body.restaurant);

        if (!category) {
            return res.status(400).send('Invalid category');
        }

        if (!restaurant) {
            return res.status(400).send('Invalid restaurant');
        }

        const file = req.file;

        if (!file) {
            return res.status(400).send('No image in the request');
        }

        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        const product = new Product({
            category: req.body.category,
            name: req.body.name,
            image: `${basePath}${fileName}`,
            price: req.body.price,
            restaurant: req.body.restaurant,
        });

        const savedProduct = await product.save();

        if (!savedProduct) {
            return res.status(500).send('The product cannot be created');
        }

        res.status(201).send(savedProduct);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    const productId = req.params.id;
    const { category, name, price, restaurant } = req.body;
  
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).send('Invalid Product Id');
    }
  
    try {
      const categoryObj = await Category.findById(category);
      if (!categoryObj) {
        return res.status(400).send('Invalid Category');
      }
  
      const restaurantObj = await Restaurant.findById(restaurant);
      if (!restaurantObj) {
        return res.status(400).send('Invalid Restaurant');
      }
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).send('Invalid Product');
      }
  
      let imagePath = product.image;
      if (req.file) {
        imagePath = req.file.path;
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { category, name, price, image: imagePath, restaurant },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(500).send('The product cannot be updated!');
      }
  
      res.send(updatedProduct);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  router.delete('/:id', async (req, res) => {
    const productId = req.params.id;
  
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).send('Invalid Product Id');
    }
  
    try {
      const product = await Product.findByIdAndRemove(productId);
  
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found!' });
      }
  
      res.status(200).json({ success: true, message: 'The product is deleted!' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  module.exports = router;
  