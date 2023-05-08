
const express = require('express');
const { Trip } = require('../models/trip');
const router = express.Router();
const mongoose = require('mongoose');



router.get(`/`, async (req, res) => {
    try {
        const tripList = await Trip.find();
        res.status(200).send(tripList);
      } catch (error) {
        res.status(402).send(error);
      }
});

router.get(`/:id`, async (req, res) => {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
        res.status(500).json({ success: false });
    } res.send(trip);
});

router.post(`/`,  async (req, res) => {
    let trip = new Trip({
        origin: req.body.origin,
        destination: req.body.destination,
    })
    trip = await trip.save();
    if (!trip) return res.status(500).send('The trip cannot be created');
    res.send(trip);
});

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Trip Id');
    }
    const updatedTrip = await Trip.findByIdAndUpdate(
        req.params.id,
        {
            origin: req.body.origin,
            destinatio: req.body.destinatio
        },
        { new: true }
    );

    if (!updatedTrip)
        return res.status(500).send('the trip cannot be updated!');

    res.send(updatedTrip);
});

router.delete('/:id', (req, res) => {
    Trip.findByIdAndRemove(req.params.id)
        .then((trip) => {
            if (trip) {
                return res.status(200).json({
                    success: true,
                    message: 'the trip is deleted!',
                });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: 'trip not found!' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ success: false, error: err });
        });
});

// router.get(`/get/count`, async (req, res) => {
//     const drinkCount = await Drink.countDocuments((count) => count);

//     if (!drinkCount) {
//         res.status(500).json({ success: false });
//     }
//     res.send({
//         drinkCount: drinkCount,
//     });
// });

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

//         const trip = await Resturant.findByIdAndUpdate(
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