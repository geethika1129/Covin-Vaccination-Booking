const User = require('../models/User');
const { validationResult } = require('express-validator');

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
      return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error('Error while logging in:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  signup: async (req, res) => {
    const { name, email, password, role } = req.body;

    // Validate the user input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Create a new user
      const newUser = new User({ name, email, password, role });

      // Save the user to the database
      await newUser.save();

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error while signing up:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  searchVaccinationCentres: async (req, res) => {
    try {
      // Assuming you have a model for VaccinationCentre with fields: name and start end
      const vaccinationCentres = await VaccinationCentre.find({});

      return res.status(200).json({ vaccinationCentres });
    } catch (error) {
      console.error('Error while searching vaccination centres:', error);
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
