const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
    origin: {
        type: String,
        required: true,
    },
    
    destination: {
        type: String,
        required: true,
    }
})

tripSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

tripSchema.set('toJSON', {
    virtuals: true,
});

exports.Trip = mongoose.model('Trip', tripSchema);
exports.tripSchema = tripSchema;