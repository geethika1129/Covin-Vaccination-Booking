const Admin = require('../models/Admin');
/* const VaccinationCentre = require('../models/Admin'); */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Centre = require('../models/centre');


const adminController = {

    
        signup: async (req, res) => {
          const { name, email, password } = req.body;
      
          try {
            // Check if the email is already registered
            const existingAdmin = await Admin.findOne({ email });
      
            if (existingAdmin) {
              return res.status(409).json({ error: 'Email already registered' });
            }
      
            // Create a new admin with the role set to "admin" by default
            const newAdmin = new Admin({ name, email, password, role: 'admin' });
      
            // Save the admin to the database
            await newAdmin.save();
      
            // Redirect to the admin login page after successful registration
            res.redirect('/admin/login');
      
          } catch (error) {
            console.error('Error while signing up:', error);
            res.status(500).json({ error: 'Server error' });
          }
        },
    
        login: async (req, res) => {
            const { email, password } = req.body;
        
            try {
              // Check if the user exists with the provided email
              const user = await Admin.findOne({ email });
        
              if (!user) {
                return res.status(404).json({ error: 'Admin not found' });
              }
        
              // Check if the password is correct
              if (user.password !== password) {
                return res.status(401).json({ error: 'Invalid password' });
              }
        
              // User login successful
              const token = jwt.sign({ adminId: Admin._id }, 'pass');
        
              // Store user information in session for future use (e.g., to check if the user is logged in)
              req.session.user = Admin;
        
              // Redirect to the main page after successful login
              res.redirect('/admin/main'); // Change '/main' to the path of your main page (e.g., '/main')
        
            } catch (error) {
              console.error('Error while logging in:', error);
              res.status(500).json({ error: 'Server error' });
            }
          },

          addVaccinationCentres: async (req, res) => {
            const { name, startTime, endTime, slotsAvailable } = req.body;
            try {
              
                const formattedStartTime = new Date(`1970-01-01T${startTime}:00Z`);
                const formattedEndTime = new Date(`1970-01-01T${endTime}:00Z`);
              // Create a new vaccination center
              const newCentre = new Centre({ name, startTime: formattedStartTime, endTime: formattedEndTime, slotsAvailable });
        
              // Save the new vaccination center to the database
              await newCentre.save();
        
              return res.status(201).json({ message: 'Vaccination centre added successfully', centre: newCentre });
            } catch (error) {
              console.error('Error while adding vaccination centre:', error);
              res.status(500).json({ error: 'Server error' });
            }
          },
        
          getVaccinationCentres: async (req, res) => {
            try {
              const centres = await Centre.find();
              res.status(200).json(centres);
            } catch (error) {
              console.error('Error while fetching vaccination centres:', error);
              res.status(500).json({ error: 'Server error' });
            }
          },

           deleteVaccinationCentre : async (req, res) => {
            const centreId = req.params.centreId;
        
            try {
                // Find the vaccination center by ID and delete it
                const deletedCentre = await Centre.findByIdAndDelete(centreId);
        
                if (!deletedCentre) {
                    return res.status(404).json({ error: 'Vaccination center not found' });
                }
        
                return res.status(200).json({ message: 'Vaccination center deleted successfully', centre: deletedCentre });
            } catch (error) {
                console.error('Error while deleting vaccination centre:', error);
                res.status(500).json({ error: 'Server error' });
            }
        }, 
 

  getDosageDetails: async (req, res) => {
    try {
      // Group dosage details by vaccination centres
      const dosageDetails = await User.aggregate([
        { $unwind: '$vaccinationSlots' },
        {
          $group: {
            _id: '$vaccinationSlots.vaccinationCentre',
            centreName: { $first: '$vaccinationSlots.vaccinationCentre' },
            totalDosages: { $sum: 1 }
          }
        },
        { $project: { _id: 0, centreName: 1, totalDosages: 1 } }
      ]);

      return res.status(200).json({ dosageDetails });
    } catch (error) {
      console.error('Error while getting dosage details:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  getDosageDetails : async (req, res) => {
    try {
      // Group vaccination centers and calculate dosage details
      const dosageDetails = await Centre.aggregate([
        {
          $group: {
            _id: '$name',
            totalSlots: { $sum: '$slotsAvailable' },
            totalCentres: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            centreName: '$_id',
            totalSlots: 1,
            totalCentres: 1,
          },
        },
      ]);
  
      res.status(200).json(dosageDetails);
    } catch (error) {
      console.error('Error while fetching dosage details:', error);
      res.status(500).json({ error: 'Server error' });
    }},

  removeVaccinationCentre: async (req, res) => {
    const { adminId, centreId } = req.body;

    try {
      // Check if the admin exists
      const admin = await Admin.findById(adminId);

      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      // Find the index of the vaccination centre in the admin's list
      const centreIndex = admin.vaccinationCentres.findIndex((centre) => centre.id === centreId);

      if (centreIndex === -1) {
        return res.status(404).json({ error: 'Vaccination centre not found' });
      }

      // Remove the vaccination centre
      admin.vaccinationCentres.splice(centreIndex, 1);

      await admin.save();

      return res.status(200).json({ message: 'Vaccination centre removed successfully', admin });
    } catch (error) {
      console.error('Error while removing vaccination centre:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  
  logout: async (req, res) => {
    try {
      // Destroy the session to log out the admin
      req.session.destroy((err) => {
        if (err) {
          console.error('Error while logging out:', err);
          res.status(500).json({ error: 'Server error' });
        } else {
          res.status(200).json({ message: 'Logout successful' });
        }
      });
    } catch (error) {
      console.error('Error while logging out:', error);
      res.status(500).json({ error: 'Server error' });
    }
}

};

module.exports = adminController;
