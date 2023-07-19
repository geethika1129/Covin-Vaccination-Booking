const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Admin = require('./models/Admin');
const session = require('express-session');


const userRoutes = require('./routes/userroutes');
const adminRoutes = require('./routes/adminroutes');

const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
// Connect to MongoDB
/* mongoose.connect('mongodb+srv://geethika1129:pass@cluster0.v0jx5ej.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); */
mongoose.connect('mongodb+srv://geethika1129:pass@cluster0.v0jx5ej.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to the database');

  // Test Query
  User.findOne({})
  .then((result) => {
    console.log('Test query result:', result);
  })
  .catch((error) => {
    console.error('Error executing test query:', error);
  });

}).catch((error) => {
  console.error('Database connection error:', error);
});

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
      secret: 'pass', // Replace this with a secure random string for session encryption
      resave: false,
      saveUninitialized: true
    })
  );





app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/user/login', (req, res) => {
  res.render('userlogin');
});

app.get('/user/signup', (req, res) => {
  res.render('usersignup');
});

app.get('/', (req, res) => {
  res.render('home');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
