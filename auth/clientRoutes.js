const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { Auth } = require('../models/clientSchema');
const { Dish } = require('../models/adminSchema');
const { Order } = require('../models/clientSchema');
const { eachOrder } = require('../models/clientSchema');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const maxAge=3*24*60*60

const nodemailer=require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'campuseatsnie@gmail.com', // Your Gmail address
    pass: 'vjahgulfjooofeoc' // Your Gmail password
  }
});

const createToken=(id)=>{
return jwt.sign({id},'clientLogin secret',{
  expiresIn:maxAge
})
}

router.post('/clientLogin', async (req, res) => {
  console.log(req.body);
  
  const { usn, dob } = req.body;

  try {
    const found = await Auth.findOne({ usn: usn });
 
    if (found && found.dob === dob) {
      req.session.user_id = found._id;
      const token = createToken(found._id);
    
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

      res.json(found);
    } else {
      console.log('error');
      res.status(401).json({ error: 'Invalid credentials' }); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/createOrder', async (req, res) => {
  const { price, id } = req.body;
  console.log(req.body)
  const data = req.body.items.map((f) => ({
    dishId: new mongoose.Types.ObjectId(f.dishId),
    quantity: f.quantity,
    hotelId:new mongoose.Types.ObjectId(f.Hotel_id),
    specialInstructions: f.specialInstructions,
  }));
 
  
   console.log(req.session)
  try {
    const newOrder = new Order({
      totalAmount: price,
      userId: id,
      hotelId:req.body.hotelId

      
     
    });
    newOrder.eachOrder = data;
   
    // console.log(newOrder)
    const savedOrder = await newOrder.save();
    if(savedOrder){
      const user = await Auth.findById(id)
      const email = user.email
      const mailOptions = {
        from: 'campuseatsnie@gmail.com',
        to: email,
        subject: 'Order Confirmation',
        text: `Your order with the order id ${id} is placed successfully you will receive a mail once the order is ready !`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ error: 'Failed to send email' });
        } else {
          console.log('Email sent:', info.response);
          res.json({ message: 'Email sent successfully' });
        }
      })
    }
    res.json(savedOrder)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/fetchDishes', async (req, res) => {
  try {
    const found = await Dish.find();

    if (found) {
      res.json(found);
    } else {
      res.json('No dishes or error fetching');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/displayOrders', async (req, res) => {
  try {
    const orders = await Order.find().populate('eachOrder.dishId');
    console.log(orders[0].eachOrder[0].dishId.imageUrl);
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/prevOrders/:id',async(req,res)=>{

  const id=req.params.id;
  const order = await Order.find({userId:id}).populate(
    'eachOrder.dishId'
  )
  res.json(order)

})
module.exports = router;
