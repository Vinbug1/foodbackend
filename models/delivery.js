const mongoose = require('mongoose');

const deliverySchema = mongoose.Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Order',
        required:true
    },
    trip:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Trip',
        required:true
    },
    rider:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        required:true
    }
})

deliverySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

deliverySchema.set('toJSON', {
    virtuals: true,
});

exports.Delivery = mongoose.model('Delievery', deliverySchema);
exports.deliverySchema = deliverySchema;