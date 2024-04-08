const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const cookieParser=require('cookie-parser')
require('dotenv').config();


const routes = require('./auth/routes');
const clientRoutes = require('./auth/clientRoutes');

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
  optionsSuccessStatus: 204,
};

const sessionConfig = {
  key:'userid',
  secret:  "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24, 
    maxAge: 1000 * 60 * 60 * 24
  }
};

app.use(session(sessionConfig));
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cookieParser)
app.use(routes);
app.use(clientRoutes);

mongoose.connect('mongodb://localhost:27017/majorproject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Database connected');
})
.catch((err) => {
  console.error('Error connecting to database:', err);
});

const PORT = process.env.PORT || 5000;
const HOST = 'localhost';
const HOST1 = '192.168.29.42';

app.listen(PORT, HOST1, () => {
  console.log(`Server running on http://${HOST1}:${PORT}`);
});
