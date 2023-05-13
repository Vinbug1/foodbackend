const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const corsOptions = { origin: 'http://localhost:3000',credentials: true };
require('dotenv').config();
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
// app.use(cors({origin: '*', credentials: true}));
// app.use(cors({origin: "*", credentials: true}));
//app.use(cors(corsOptions));
// app.options('*', cors());
// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors(corsOptions));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use('/public/restUploads', express.static(__dirname + '/public/restUploads'));
app.use('/public/userUploads', express.static(__dirname + '/public/userUploads'));
app.use(errorHandler);

// Routes
const api = process.env.API_URL;
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const restaurantsRoutes = require('./routes/restaurants');
const drinksRoutes = require('./routes/drinks');
const tripsRoutes = require('./routes/trips');
const ridersRoutes = require('./routes/riders');
const deliveriesRoutes = require('./routes/deliveries');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/restaurants`, restaurantsRoutes);
app.use(`${api}/drinks`, drinksRoutes);
app.use(`${api}/trips`, tripsRoutes);
app.use(`${api}/riders`, ridersRoutes);
app.use(`${api}/deliveries`, deliveriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

// Database
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'greyfoods-db',
}).then(() => {
  console.log('Database Connection is ready...');
}).catch((err) => {
  console.log(err);
});

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
