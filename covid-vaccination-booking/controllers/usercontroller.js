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

          
// controllers/userController.js
applyForVaccinationSlot: async (req, res) => {
    const userName = req.body.userName;
    const centerName = req.body.centerName;
    const appointmentDateStr = req.body.date; // Date input from the form

    try {
        // Check if the date is provided in the request body
        if (!appointmentDateStr) {
            return res.status(400).json({ error: 'Appointment date is required' });
        }

        // Convert the date string to a valid JavaScript Date object
        const appointmentDate = new Date(appointmentDateStr);

        // Check if the appointmentDate is valid (not an "Invalid Date" object)
        if (isNaN(appointmentDate)) {
            return res.status(400).json({ error: 'Invalid appointment date format' });
        }

        // Find the user by userName
        const user = await User.findOne({ name: userName });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find all appointments for the user on the specified date at any center
        const userAppointments = await Appointment.find({
            user: user.name,
            date: appointmentDate,
        });

        // Check if the user has already booked 10 appointments on the same day
        if (userAppointments.length >= 10) {
            return res.status(403).json({ error: 'You have reached the maximum limit of appointments for the day' });
        }

        // Find the vaccination center by name
        const centre = await Centre.findOne({ name: centerName });
        if (!centre) {
            return res.status(404).json({ error: 'Vaccination center not found' });
        }

        // Find all appointments for the center on the specified date
        const centerAppointments = await Appointment.find({
            centre: centre.name,
            date: appointmentDate,
        });

        // Check if the center has reached its maximum capacity for the day
        if (centerAppointments.length >= 10) {
            return res.status(403).json({ error: 'Vaccination center is fully booked for the day' });
        }

        // Create a new appointment record
        const newAppointment = new Appointment({
            user: user._id, // Assign the user's _id to the appointment's user field
            centre: centre._id,
            date: appointmentDate,
        });

        // Save the appointment record to the database
        await newAppointment.save();

        res.status(200).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        console.error('Error while booking appointment:', error);
        res.status(500).json({ error: 'Server error' });
    }
},
getAppointments: async (req, res) => {
    try {
      const appoint = await Appointment.find();
      res.status(200).json(appoint);
    } catch (error) {
      console.error('Error while fetching vaccination centres:', error);
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
