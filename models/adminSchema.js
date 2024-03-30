const mongoose = require("mongoose");
const {Order}=require('./clientSchema')
const imageSchema= new mongoose.Schema({
  url:  String,
  filename:String

})
const signupSchema = new mongoose.Schema({
    email: {
        type: String,
      
    },
    password: {
        type: String,
       
    },
});



const dishSchema = new mongoose.Schema({
  name: {
    type: String,
   
  },
  description: {
    type: String,
    
  },
  price: {
    type: Number,
   
  },
  category: {
    type: String,
  
  },
  quantity:{
    type:Number,
  },
  imageUrl: {
    type: [imageSchema],
  },
  ingredients: {
    type: [String], 
  },
  isVegetarian:{
    type:Boolean
  },
  Review:[{
    type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
  }],
  Hotel_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
  }


});
const hotelSchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: { 
    type: String
  },
  phone: {
    type: Number
  },
  email: {
    type: String
  },
  reviews: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  }],
  geometry:{
    coordinates: {
      type: [Number], // Array of arrays of arrays of numbers
      required: true
    },
  type: {
    type: String,
    enum: ['Point'],
    required: true
  }
  
  },
  user:
  [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Signup'
  }],
  imageUrl: {
    type: [imageSchema],
  },
  
});

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
});

const acceptedOrderSchema= new mongoose.Schema(
  {
    hotelId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true
    },
    orderId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    }

  }
)

const Review = mongoose.model('Review', reviewSchema);
const Dish = mongoose.model('Dish', dishSchema);
const Signup = mongoose.model('Signup', signupSchema);
const Hotel=mongoose.model('Hotel',hotelSchema)
const acceptedOrders=mongoose.model('AcceptedOrder',acceptedOrderSchema)

module.exports = {
  Review,
  Dish,
  Signup,
  Hotel,
  acceptedOrders
};
