const { Rider } = require('../models/rider');
const express = require('express');
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
        const riderList = await Rider.find();
        res.status(200).send(riderList);
      } catch (error) {
        res.status(402).send(error);
      }
});

router.get(`/:id`, async (req, res) => {
    const rider = await Rider.findById(req.params.id);
    if (!rider) {
        res.status(500).json({ success: false });
    } res.send(rider);
});

router.post(`/`, uploadOptions.single('image'), async (req, res) => {

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/restUploads/`;
    
    let rider = new Rider({
        name: req.body.name,
        image: `${basePath}${fileName}`, 
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
       // passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
    })
    rider = await rider.save();
    if (!rider) return res.status(500).send('The rider cannot be created');
    res.send(rider);
});

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Resturant Id');
    }
    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(400).send('Invalid Rider!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/restUploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = rider.image;
    }

    const updatedRider = await Rider.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            image: `${basePath}${fileName}`, 
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
        },
        { new: true }
    );
    if (!updatedRider)
        return res.status(500).send('the rider cannot be updated!');
    res.send(updatedRider);
});

router.delete('/:id', (req, res) => {
    Rider.findByIdAndRemove(req.params.id)
        .then((rider) => {
            if (rider) {
                return res.status(200).json({
                    success: true,
                    message: 'the rider is deleted!',
                });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: 'rider not found!' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

router.get(`/get/count`, async (req, res) => {
    const productCount = await Rider.countDocuments((count) => count);

    if (!productCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        productCount: productCount,
    });
});

// router.get(`/get/featured/:count`, async (req, res) => {
//     const count = req.params.count ? req.params.count : 0;
//     const products = await Resturant.find({ isFeatured: true }).limit(+count);

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

//         const rider = await Resturant.findByIdAndUpdate(
//             req.params.id,
//             {
//                 images: imagesPaths,
//             },
//             { new: true }
//         );

//         if (!rider)
//             return res.status(500).send('the gallery cannot be updated!');

//         res.send(rider);
//     }
// );

module.exports = router;