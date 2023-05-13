 const { Delievery } = require('../models/delievery');
const express = require('express');
const { Trip } = require('../models/trip');
const { Rider} = require('../models/rider');
const { Order } = require('../models/order');
//const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');



router.get(`/`, async (req, res) => {
    try {
        const delieryList = await Delievery.find();
        res.status(200).send(delieryList);
      } catch (error) {
        res.status(402).send(error);
      }
});

router.get(`/:id`, async (req, res) => {
    const delievery = await Delievery.findById(req.params.id);
    if (!delievery) {
        res.status(500).json({ success: false });
    } res.send(delievery);
});

router.post(`/`,  async (req, res) => {
    const order = await Order.findById(req.body.order);
    if (!order) return res.status(400).send('Invalid Order');
    const trip = await Trip.findById(req.body.trip);
    if (!trip) return res.status(400).send('Invalid Trip');
    const rider = await Rider.findById(req.body.rider);
    if (!rider) return res.status(400).send('Invalid Category');
    let delievery = new Delievery({
        order: req.body.order,
        trip: req.body.trip,
        rider: req.body.rider,
        status: req.body.status
    })
    delievery = await delievery.save();
    if (!delievery) return res.status(500).send('The delievery cannot be created');
    res.send(delievery);
});

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Drink Id');
    }
    const order = await Order.findById(req.body.order);
    if (!order) return res.status(400).send('Invalid Order');
    const trip = await Trip.findById(req.body.trip);
    if (!trip) return res.status(400).send('Invalid Trip');
    const rider = await Rider.findById(req.body.rider);
    if (!rider) return res.status(400).send('Invalid Category');
    const updatedDelievery = await Delievery.findByIdAndUpdate(
        req.params.id,
        {
            order: req.body.order,
            trip: req.body.trip,
            rider: req.body.rider,
            status: req.body.status,
        },
        { new: true }
    );
    if (!updatedDelievery)
        return res.status(500).send('the delievery cannot be updated!');

    res.send(updatedDelievery);
});

router.delete('/:id', (req, res) => {
    Delievery.findByIdAndRemove(req.params.id)
        .then((delievery) => {
            if (delievery) {
                return res.status(200).json({
                    success: true,
                    message: 'the delievery is deleted!',
                });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: 'delievery not found!' });
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



module.exports = router;