const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt.js');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('http://localhost:3000', cors());

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use('/public/restUploads', express.static(__dirname + '/public/restUploads'));
app.use('/public/userUploads', express.static(__dirname + '/public/userUploads'));
//app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const resturantsRoutes = require('./routes/resturants');
const drinksRoutes = require('./routes/drinks');
const tripsRoutes = require('./routes/trips');
const ridersRoutes = require('./routes/riders');
const delieveriesRoutes = require('./routes/delieveries');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL;
//const port = process.env.PORT;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/resturants`, resturantsRoutes);
app.use(`${api}/drinks`, drinksRoutes);
app.use(`${api}/trips`, tripsRoutes);
app.use(`${api}/riders`, ridersRoutes);
app.use(`${api}/delieveries`, delieveriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Database
mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,useUnifiedTopology: true,
        dbName: 'greyfoods-db',
    })
    .then(() => {
        console.log('Database Connection is ready...');
    })
    .catch((err) => {
        console.log(err);
    });

//Server
app.listen(8000, () => {
    console.log('server is running http://localhost:8000');
});