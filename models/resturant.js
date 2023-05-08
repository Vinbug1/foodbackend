const mongoose = require('mongoose');

const resturantSchema = mongoose.Schema({
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


resturantSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

resturantSchema.set('toJSON', {
    virtuals: true,
});

exports.Resturant = mongoose.model('Resturant', resturantSchema);
exports.resturantSchema = resturantSchema;