const mongoose = require('mongoose');

const riderSchema = mongoose.Schema({
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
   
    address:{
        type:String,
        required: true
    }
  
})


riderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

riderSchema.set('toJSON', {
    virtuals: true,
});

exports.Rider = mongoose.model('Rider', riderSchema);
exports.riderSchema = riderSchema;