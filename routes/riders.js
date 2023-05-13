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
        const uploadError = new Error('Invalid image type');

        if (isValid) {
            cb(null, 'public/restUploads');
        } else {
            cb(uploadError);
        }
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const riderList = await Rider.find();
        res.status(200).send(riderList);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const rider = await Rider.findById(req.params.id);
        if (rider) {
            res.send(rider);
        } else {
            res.status(404).send('Rider not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.post('/', uploadOptions.single('image'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).send('No image in the request');
        } else {
            const fileName = file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/restUploads/`;
            const rider = new Rider({
                name: req.body.name,
                image: `${basePath}${fileName}`,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
            });
            const newRider = await rider.save();
            res.status(201).send(newRider);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Update a rider by ID
router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Rider Id');
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
            image: imagepath, // use imagepath variable here
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

// Delete a rider by ID
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

// Get the count of riders
router.get(`/get/count`, async (req, res) => {
    const riderCount = await Rider.countDocuments((count) => count);

    if (!riderCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        riderCount: riderCount,
    });
});

module.exports = router;