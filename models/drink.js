const mongoose = require('mongoose');

const drinkSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    
    image: {
        type: String,
        default: ''
    },
    brand: {
        type: String,
        required: true
    },
    price : {
        type: Number,
        default:0
    },
    
})


drinkSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

drinkSchema.set('toJSON', {
    virtuals: true,
});

exports.Drink = mongoose.model('Drink', drinkSchema);
exports.drinkSchema = drinkSchema;