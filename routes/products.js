const { Product } = require('../models/product');
const { Category } = require('../models/category');
const express = require('express');
const { Resturant } = require('../models/resturant');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

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


router.get(`/`, async (req, res) => {
    try {
        const productList = await Product.find().populate('resturant');
        res.status(200).send(productList);
      } catch (error) {
        res.status(402).send(error);
      }
});

router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('resturant');
    if (!product) {
        res.status(500).json({ success: false });
    }
    res.send(product);
});

router.post(`/`, uploadOptions.single('image'), async (req, res) => {

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const resturant = await Resturant.findById(req.body.resturant);
    if (!resturant) return res.status(400).send('Invalid Resturant');

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let product = new Product({ 
        category:req.body.category,
         name: req.body.name, 
         image: `${basePath}${fileName}`, 
         price: req.body.price, 
         resturant: req.body.resturant
         });

    product = await product.save();
    if (!product) return res.status(500).send('The product cannot be created');
    res.send(product);
});

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const resturant = await Resturant.findById(req.body.resturant);
    if (!resturant) return res.status(400).send('Invalid Resturant');

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid Product!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {   
            category:req.body.category,
            name: req.body.name,
            price: req.body.price,
            image: imagepath,
            resturant: req.body.resturant
        },{ new: true }
    );
    if (!updatedProduct)
        return res.status(500).send('the product cannot be updated!');
    res.send(updatedProduct);
});

router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then((product) => {
            if (product) {
                return res.status(200).json({
                    success: true,
                    message: 'the product is deleted!',
                });
            } else {
                return res
                    .status(404).json({ success: false, message: 'product not found!' });
            }
        }).catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

module.exports = router;