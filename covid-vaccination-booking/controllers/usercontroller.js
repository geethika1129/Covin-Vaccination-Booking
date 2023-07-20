const User = require('../models/User');
const Centre=require('../models/centre');
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
    try {
      const { userId, vaccinationCentreId, slotDate } = req.body;

      // Check if the user exists
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if the user already has 10 vaccination slots for the day
      if (user.vaccinationSlots.length >= 10) {
        return res.status(403).json({ error: 'Maximum slots reached for the day' });
      }

      // Apply for the vaccination slot
      user.vaccinationSlots.push({
        vaccinationCentre: vaccinationCentreId,
        slotDate: new Date(slotDate)
      });

      await user.save();

      return res.status(200).json({ message: 'Vaccination slot applied successfully', user });
    } catch (error) {
      console.error('Error while applying for a vaccination slot:', error);
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
