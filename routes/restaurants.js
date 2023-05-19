const { Restaurant } = require('../models/restaurant');
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

router.get('/', async (req, res) => {
    try {
      const restaurantList = await Restaurant.find();
      res.status(200).json(restaurantList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  router.get('/:id', async (req, res) => {
    try {
      const restaurantId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        return res.status(400).json({ message: 'Invalid restaurant ID' });
      }
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      res.status(200).json(restaurant);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  router.post('/', uploadOptions.single('image'), async (req, res) => {
    try {
      // const file = req.file;
      // if (!file) return res.status(400).send('No image in the request');
  
      // const fileName = file.filename;
      // const basePath = `${req.protocol}://${req.get('host')}/public/restUploads/`;
  
      let restaurant = new Restaurant({
        fullname: req.body.fullname,
        // image: `${basePath}${fileName}`, 
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
      });
      
      restaurant = await restaurant.save();
      if (!restaurant) return res.status(500).send('The restaurant cannot be created');
      res.send(restaurant);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  
  


// router.post(`/`, uploadOptions.single('image'), async (req, res) => {

//     const file = req.file;
//     if (!file) return res.status(400).send('No image in the request');

//     const fileName = file.filename;
//     const basePath = `${req.protocol}://${req.get('host')}/public/restUploads/`;
    
//     let resturant = new Resturant({
//         name: req.body.name,
//         image: `${basePath}${fileName}`, 
//         email: req.body.email,
//         phone: req.body.phone,
//         address: req.body.address,
//        // passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
//     })
//     resturant = await resturant.save();
//     if (!resturant) return res.status(500).send('The resturant cannot be created');
//     res.send(resturant);
// });

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    try {
      const restaurantId = req.params.id;
      if (!mongoose.isValidObjectId(resturantId)) {
        return res.status(400).send('Invalid resturant ID');
      }
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(400).send('Invalid resturant!');
      }
      // const file = req.file;
      // let imagePath = restaurant.image;
      // if (file) {
      //   const fileName = file.filename;
      //   const basePath = `${req.protocol}://${req.get('host')}/public/restUploads/`;
      //   imagePath = `${basePath}${fileName}`;
      // }
      //const saltRounds = 10;
      //const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        restaurantId,
        {
         fullname: req.body.fullname,
          // image: imagePath,
          email: req.body.email,
          phone: req.body.phone,
         // passwordHash: hashedPassword,
          address: req.body.address,
        },
        { new: true }
      );
      if (!updatedRestaurant) {
        return res.status(500).send('The resturant cannot be updated');
      }
      res.send(updatedRestaurant);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  router.delete('/:id', async (req, res) => {
    try {
        const deletedRestaurant = await Restaurant.findByIdAndRemove(req.params.id);
        if (deletedRestaurant) {
            return res.status(200).json({
                success: true,
                message: 'The restaurant has been deleted successfully',
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'An error occurred while deleting the resturant',
        });
    }
});


router.get(`/get/count`, async (req, res) => {
    try {
      const restaurantCount = await Restaurant.countDocuments();
      res.status(200).json({ restaurantCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error });
    }
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

//         const resturant = await Resturant.findByIdAndUpdate(
//             req.params.id,
//             {
//                 images: imagesPaths,
//             },
//             { new: true }
//         );

//         if (!resturant)
//             return res.status(500).send('the gallery cannot be updated!');

//         res.send(resturant);
//     }
// );

module.exports = router;