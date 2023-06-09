const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {User }= require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require('nodemailer');


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

// router.get(`/`, async (req, res) =>{
//     try {
//         const userList = await User.find({role:"Vendor"});
//         res.status(200).send(userList);
//       } catch (error) {
//         //console.error("what is going on",error);
//         res.status(402).send(error);
//       }
// })

router.get(`/`, async (req, res) => {
    try {
      const userList = await User.find({ role: "rider" });
      res.status(200).send(userList);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  


// router.get(`/`, async (req, res) =>{
//     try {
//         const userList = await User.find({role:"rider"});
//         res.status(200).send(userList);
//       } catch (error) {
//         //console.error("what is going on",error);
//         res.status(402).send(error);
//       }
// })

router.get('/vendor', async (req, res) =>{
    try {
      const userList = await User.find({role: "vendor"});
      res.status(200).send(userList);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching the user list.');
    }
  });
  
// router.get(`/`, async (req, res) =>{
//     try {
//         const userList = await User.find({role:"vendor"});
//         res.status(200).send(userList);
//       } catch (error) {
//         //console.error("what is going on",error);
//         res.status(402).send(error);
//       }
// })


router.get('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  



// router.get('/:id', async(req,res)=>{
//     const user = await User.findById(req.params.id);
//     if(!user) {
//         res.status(500).json({message: 'The user with the given ID was not found.'})
//     } 
//     res.status(200).send(user);
// })

router.post('/', async (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No image in the request');
    }
  
    // const fileName = file.filename;
    // const basePath = `${req.protocol}://${req.get('host')}/public/userUpload/`;
  
    const user = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
      phone: req.body.phone,
      address: req.body.address,
      role: req.body.role,
      // image: `${basePath}${fileName}`,
    });
  
    try {
      const savedUser = await user.save();
      res.send(savedUser);
    } catch (error) {
      res.status(400).send('Failed to create user');
    }
  });
  

// router.post('/', uploadOptions.single('image'), async (req,res)=>{

//     const file = req.file;
//     if (!file) return res.status(400).send('No image in the request');

//     const fileName = file.filename;
//     const basePath = `${req.protocol}://${req.get('host')}/public/userUpload/`;
    
//     let user = new User({
//         fullname: req.body.fullname,
//         image: `${basePath}${fileName}`,
//         email: req.body.email,
//         passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
//         phone: req.body.phone,
//         address: req.body.address,
//         role:req.body.role
//     })
//     user = await user.save();
//     if(!user)
//     return res.status(400).send('the user cannot be created!')
//     res.send(user);
// })

router.put('/:id', uploadOptions.single('image'), async (req, res)=> {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid User Id');
    }

    // const file = req.file;
    // let imagepath;

    // if (file) {
    //     const fileName = file.filename;
    //     const basePath = `${req.protocol}://${req.get('host')}/public/userUploads/`;
    //     imagepath = `${basePath}${fileName}`;
    // } else {
    //     imagepath = req.body.image;
    // }

    const userUpdate = await User.findByIdAndUpdate(
        req.params.id,
        {
            fullname: req.body.fullname,
            // image: imagepath,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            address: req.body.address,
            role:req.body.role
        },{ new: true}
    );
    
    if(!userUpdate)
        return res.status(400).send('the user cannot be updated!')
    
    res.send(userUpdate);
});

// router.put('/:id', uploadOptions.single('image'), async (req, res)=> {

//     if (!mongoose.isValidObjectId(req.params.id)) {
//         return res.status(400).send('Invalid Product Id');
//     }
//     const file = req.file;
//     let imagepath;

//     if (file) {
//         const fileName = file.filename;
//         const basePath = `${req.protocol}://${req.get('host')}/public/userUploads/`;
//         imagepath = `${basePath}${fileName}`;
//     } else {
//         imagepath = product.image;
//     }
//     const userUpdate = await User.findByIdAndUpdate(
//         req.params.id,
//         {
//             fullname: req.body.fullname,
//             image: imagepath,
//             email: req.body.email,
//             passwordHash: bcrypt.hashSync(req.body.password, 10),
//             phone: req.body.phone,
//             address: req.body.address,
//             role:req.body.role
//         },{ new: true}
//     );
//     if(!userUpdate)
//     return res.status(400).send('the user cannot be created!')
//     res.send(userUpdate);
// })

router.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      const secret = process.env.secret;
      if (!user) {
        return res.status(400).send('The user not found');
      }
      if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });
        const { email, password, role } = user;
        res.status(200).send({ email,token, password, role });
      } else {
        res.status(400).send('Invalid email or password');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  
// router.post('/login', async (req,res) => {
//     const user = await User.findOne({email: req.body.email})
//     const secret = process.env.secret;
//     if(!user) {
//         return res.status(400).send('The user not found');
//     }
//     if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
//         const token = jwt.sign({ userId: user.id},secret,{expiresIn : '1d'} )
//         res.status(200).send({user: user.email , token: token, user:user.password,user:user.role}); 
//     } else {
//        res.status(400).send('password is wrong!');
//     }
// })

router.post('/register', async (req, res) => {

      //const userEmail= process.env.EMAIL;
      //const userPassword = process.env.PASSWORD;
    try {
      // const file = req.file;
      // if (!file) {
      //   return res.status(400).send('No image in the request');
      // }
  
      // const fileName = file.filename;
      // const basePath = `${req.protocol}://${req.get('host')}/public/userUpload/`;
  
      const user = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        address: req.body.address,
        role: req.body.role,
      });  
      const savedUser = await user.save();
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        //debug: true,
        //logger:true,
        secureConnection: false,
        tls:{
            rejectUnauthorized:true,
        },
        auth: {
          user: 'azgreyfoods@gmail.com',
          pass: ' Azgreyfoods2023.'
        }
      });
      const mailOptions = {
        from: 'azservicedelivery@gmail.com',
        to: user.email,
        subject: 'Welcome to greyExpressFoods',
        html: `<h2>Welcome to our App!</h2>
        <p>Your email address is: ${req.body.email}</p>
        <p>Your password is: ${req.body.password}</p>`
         
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.send(savedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  

// router.post('/register',uploadOptions.single('image'), async (req,res)=>{

//     const file = req.file;
//     if (!file) return res.status(400).send('No image in the request');

//     const fileName = file.filename;
//     const basePath = `${req.protocol}://${req.get('host')}/public/userUpload/`;
    
//     let user = new User({
//         fullname: req.body.fullname,
//         email: req.body.email,
//         passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
//         image: `${basePath}${fileName}`, 
//         phone: req.body.phone,
//         // isAdmin: req.body.isAdmin,
//         address: req.body.address,
//         role: req.body.role
//     })
//     user = await user.save();

//     if(!user)
//     return res.status(400).send('the user cannot be created!')

//     res.send(user);
// })


router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments((count) => count)

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
})


module.exports =router;