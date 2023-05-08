const { Drink } = require('../models/drink');
const express = require('express');
//const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');

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
        cb(uploadError, 'public/restUploads');
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
        const drinkList = await Drink.find();
        res.status(200).send(drinkList);
      } catch (error) {
        res.status(402).send(error);
      }
});

router.get(`/:id`, async (req, res) => {
    const drink = await Drink.findById(req.params.id);
    if (!drink) {
        res.status(500).json({ success: false });
    } res.send(drink);
});

router.post(`/`, uploadOptions.single('image'), async (req, res) => {

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/restUploads/`;
    
    let drink = new Drink({
        name: req.body.name,
        image: `${basePath}${fileName}`, 
        brand: req.body.brand,
        price: req.body.price,
       // address: req.body.address,
       // passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
    })
    drink = await drink.save();
    if (!drink) return res.status(500).send('The drink cannot be created');
    res.send(drink);
});

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Drink Id');
    }
    const drink = await Drink.findById(req.params.id);
    if (!drink) return res.status(400).send('Invalid Drink!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/restUploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = drink.image;
    }

    const updatedDrink = await Drink.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name, image: `${basePath}${fileName}`, 
            brand: req.body.brand,price: req.body.price,
        },{ new: true }
    );

    if (!updatedDrink) return res.status(500).send('the drink cannot be updated!');
    res.send(updatedDrink);
});

router.delete('/:id', (req, res) => {
    Drink.findByIdAndRemove(req.params.id)
        .then((drink) => {
            if (drink) {
                return res.status(200).json({
                    success: true,
                    message: 'the drink is deleted!',
                });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: 'drink not found!' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

router.get(`/get/count`, async (req, res) => {
    const drinkCount = await Drink.countDocuments((count) => count);

    if (!drinkCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        drinkCount: drinkCount,
    });
});

// router.get(`/get/featured/:count`, async (req, res) => {
//     const count = req.params.count ? req.params.count : 0;
//     const products = await Drink.find({ isFeatured: true }).limit(+count);

//     if (!products) {
//         res.status(500).json({ success: false });
//     }
//     res.send(products);
// });

// router.put(
//     '/gallery-images/:id',
//     uploadOptions.array('images', 10),
//     async (req, res) => {
//         if (!mongoose.isValidObjectId(req.params.id)) {
//             return res.status(400).send('Invalid Resturant Id');
//         }
//         const files = req.files;
//         let imagesPaths = [];
//         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

//         if (files) {
//             files.map((file) => {
//                 imagesPaths.push(`${basePath}${file.filename}`);
//             });
//         }

//         const drink = await Resturant.findByIdAndUpdate(
//             req.params.id,
//             {
//                 images: imagesPaths,
//             },
//             { new: true }
//         );

//         if (!drink)
//             return res.status(500).send('the gallery cannot be updated!');

//         res.send(drink);
//     }
// );

module.exports = router;