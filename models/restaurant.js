const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema({
   fullname: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true
    },
    phone : {
        type: String,
        required: true
    },
    // passwordHash: {
    //     type: String,
    //     required: true
    // },
    address:{
        type:String,
        required: true
    }
  
})


restaurantSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

restaurantSchema.set('toJSON', {
    virtuals: true,
});

exports.Restaurant = mongoose.model('Restaurant', resturantSchema);
exports.restaurantSchema = restaurantSchema;