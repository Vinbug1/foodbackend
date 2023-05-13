const { Delivery } = require('../models/delivery');
const express = require('express');
const { Trip } = require('../models/trip');
const { Rider} = require('../models/rider');
const { Order } = require('../models/order');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

router.get(`/`, async (req, res) => {
  try {
    const deliveryList = await Delivery.find();
    res.status(200).send(deliveryList);
  } catch (error) {
    res.status(402).send(error);
  }
});

router.get(`/:id`, async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      res.status(500).json({ success: false });
    } else {
      res.send(delivery);
    }
  } catch (error) {
    res.status(402).send(error);
  }
});

router.post(`/`, async (req, res) => {
  try {
    const order = await Order.findById(req.body.order);
    if (!order) return res.status(400).send('Invalid Order');
    const trip = await Trip.findById(req.body.trip);
    if (!trip) return res.status(400).send('Invalid Trip');
    const rider = await Rider.findById(req.body.rider);
    if (!rider) return res.status(400).send('Invalid Category');
    let delivery = new Delivery({
      order: req.body.order,
      trip: req.body.trip,
      rider: req.body.rider,
      status: req.body.status
    })
    delivery = await delivery.save();
    if (!delivery) return res.status(500).send('The delivery cannot be created');
    res.send(delivery);
  } catch (error) {
    res.status(402).send(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Invalid Delivery Id');
    }
    const order = await Order.findById(req.body.order);
    if (!order) return res.status(400).send('Invalid Order');
    const trip = await Trip.findById(req.body.trip);
    if (!trip) return res.status(400).send('Invalid Trip');
    const rider = await Rider.findById(req.body.rider);
    if (!rider) return res.status(400).send('Invalid Category');
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      {
        order: req.body.order,
        trip: req.body.trip,
        rider: req.body.rider,
        status: req.body.status,
      },
      { new: true }
    );
    if (!updatedDelivery) {
      return res.status(500).send('The delivery cannot be updated!');
    }
    res.send(updatedDelivery);
  } catch (error) {
    res.status(402).send(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedDelivery = await Delivery.findByIdAndRemove(req.params.id);
    if (deletedDelivery) {
      res.status(200).json({
        success: true,
        message: 'The delivery is deleted!',
      });
    } else {
      res.status(404).json({ success: false, message: 'Delivery not found!' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});




//  const { Delivery } = require('../models/delivery');
// const express = require('express');
// const { Trip } = require('../models/trip');
// const { Rider} = require('../models/rider');
// const { Order } = require('../models/order');
// //const { Category } = require('../models/category');
// const router = express.Router();
// const mongoose = require('mongoose');
// const multer = require('multer');
// //const bcrypt = require('bcryptjs');
// //const jwt = require('jsonwebtoken');



// router.get(`/`, async (req, res) => {
//     try {
//         const deliveryList = await Delivery.find();
//         res.status(200).send(deliveryList);
//       } catch (error) {
//         res.status(402).send(error);
//       }
// });

// router.get(`/:id`, async (req, res) => {
//     const delivery = await Delivery.findById(req.params.id);
//     if (!delivery) {
//         res.status(500).json({ success: false });
//     } res.send(delivery);
// });

// router.post(`/`,  async (req, res) => {
//     const order = await Order.findById(req.body.order);
//     if (!order) return res.status(400).send('Invalid Order');
//     const trip = await Trip.findById(req.body.trip);
//     if (!trip) return res.status(400).send('Invalid Trip');
//     const rider = await Rider.findById(req.body.rider);
//     if (!rider) return res.status(400).send('Invalid Category');
//     let delivery = new Delivery({
//         order: req.body.order,
//         trip: req.body.trip,
//         rider: req.body.rider,
//         status: req.body.status
//     })
//     delivery = await delivery.save();
//     if (!delivery) return res.status(500).send('The delivery cannot be created');
//     res.send(delivery);
// });

// router.put('/:id', async (req, res) => {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//         return res.status(400).send('Invalid Drink Id');
//     }
//     const order = await Order.findById(req.body.order);
//     if (!order) return res.status(400).send('Invalid Order');
//     const trip = await Trip.findById(req.body.trip);
//     if (!trip) return res.status(400).send('Invalid Trip');
//     const rider = await Rider.findById(req.body.rider);
//     if (!rider) return res.status(400).send('Invalid Category');
//     const updatedDelivery = await Delivery.findByIdAndUpdate(
//         req.params.id,
//         {
//             order: req.body.order,
//             trip: req.body.trip,
//             rider: req.body.rider,
//             status: req.body.status,
//         },
//         { new: true }
//     );
//     if (!updatedDelivery)
//         return res.status(500).send('the delivery cannot be updated!');

//     res.send(updatedDelivery);
// });

// router.delete('/:id', (req, res) => {
//     Delivery.findByIdAndRemove(req.params.id)
//         .then((delivery) => {
//             if (delivery) {
//                 return res.status(200).json({
//                     success: true,
//                     message: 'the delivery is deleted!',
//                 });
//             } else {
//                 return res
//                     .status(404)
//                     .json({ success: false, message: 'delivery not found!' });
//             }
//         })
//         .catch((err) => {
//             return res.status(500).json({ success: false, error: err });
//         });
// });

// router.get(`/get/count`, async (req, res) => {
//     const drinkCount = await Drink.countDocuments((count) => count);

//     if (!drinkCount) {
//         res.status(500).json({ success: false });
//     }
//     res.send({
//         drinkCount: drinkCount,
//     });
// });



module.exports = router;