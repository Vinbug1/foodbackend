const mongoose = require('mongoose');

const delieverySchema = mongoose.Schema({
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

delieverySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

delieverySchema.set('toJSON', {
    virtuals: true,
});

exports.Delievery = mongoose.model('Delievery', delieverySchema);
exports.delieverySchema = delieverySchema;