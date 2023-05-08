const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    quantity: {
        type: Number,
        required: true
    },
    drink:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Drink',
       required:true
    }],

    drinkCount:{
        type:Number,
        required: true
    }
})

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);
