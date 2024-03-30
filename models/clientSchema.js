const mongoose = require('mongoose');
const Dish = require('./adminSchema');
const Hotel=require('./adminSchema')
const orderSchema = new mongoose.Schema({

  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
  },
  eachOrder: [
    {
      dishId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      specialInstructions: {
        type: String,
      },
      hotelId:{type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        } 
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  hotelId:{type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    } 
});

const authSchema = new mongoose.Schema({
  usn: {
    type: String,
  },
  dob: {
    type: String,
  },
  name: {
    type: String,
  },
  email:{
    type:String
  }
});

const Auth = mongoose.model('Auth', authSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = { Auth, Order };
