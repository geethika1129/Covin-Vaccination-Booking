const User = require('../models/User');
const Centre=require('../models/centre');
const Appointment=require('../models/Appointment');
const { validationResult } = require('express-validator');
const bodyParser = require('body-parser');

const userController = {
    
        login: async (req, res) => {
          const { email, password } = req.body;
      
          try {
            // Check if the user exists with the provided email
            const user = await User.findOne({ email });
      
            if (!user) {
              return res.status(404).json({ error: 'User not found' });
            }
      
            // Check if the password is correct
            if (user.password !== password) {
              return res.status(401).json({ error: 'Invalid password' });
            }
      
            // User login successful
      
            // Store user information in session for future use (e.g., to check if the user is logged in)
            req.session.user = user;
      
            // Redirect to the main page after successful login
            res.redirect('/main'); // Change '/main' to the path of your main page (e.g., '/main')
      
          } catch (error) {
            console.error('Error while logging in:', error);
            res.status(500).json({ error: 'Server error' });
          }
        },
      
        // Other controller methods...
      

        signup: async (req, res) => {
            const { name, email, password } = req.body;
        
            try {
              // Check if the email is already registered
              const existingUser = await User.findOne({ email });
        
              if (existingUser) {
                return res.status(409).json({ error: 'Email already registered' });
              }
        
              // Create a new user with the role set to "user" by default
              const newUser = new User({ name, email, password, role: 'user' });
        
              // Save the user to the database
              await newUser.save();
        
              // Redirect to the user login page after successful registration
              res.redirect('/user/login');
        
            } catch (error) {
              console.error('Error while signing up:', error);
              res.status(500).json({ error: 'Server error' });
            }
          },
        

          searchCentre: async (req, res) => {
    const searchQuery = req.query.query;

    try {
        // Search for vaccination centers whose name contains the search query (case-insensitive)
        const results = await Centre.find(
            { name: { $regex: searchQuery, $options: 'i' } },
            'name startTime endTime slotsAvailable'
        );

        // Respond with the search results
        res.status(200).json(results);
    } catch (error) {
        console.error('Error while searching:', error);
        res.status(500).json({ error: 'Server error' });
    }
},

          

  applyForVaccinationSlot: async (req, res) => {
   // controllers/userController.js


    const userName = req.body.userName;
    const centerName = req.body.centerName;

    try {
        // Find the user by name
        const user = await User.findOne({ name: userName });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the vaccination center by name
        const centre = await Centre.findOne({ name: centerName });
        if (!centre) {
            return res.status(404).json({ error: 'Vaccination center not found' });
        }

        // Get the current date
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set the time to midnight to compare dates

        // Find all appointments for the center on the current date
        const appointments = await Appointment.find({
            centre: centre._id,
            date: currentDate,
        });

        // Check if the center has reached its maximum capacity for the day
        if (appointments.length >= centre.maxCapacity) {
            return res.status(403).json({ error: 'Vaccination center is fully booked for the day' });
        }

        // Create a new appointment record
        const newAppointment = new Appointment({
            user: user._id,
            centre: centre._id,
            date: currentDate,
        });

        // Save the appointment record to the database
        await newAppointment.save();

        res.status(200).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        console.error('Error while booking appointment:', error);
        res.status(500).json({ error: 'Server error' });
    }
},


  logout: async (req, res) => {
    try {
      // Assuming you have a session mechanism, you can clear the user session here
      // For example, if you're using express-session:
      req.session.destroy();
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error while logging out:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = userController;
