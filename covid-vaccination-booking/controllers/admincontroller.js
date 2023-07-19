const Admin = require('../models/Admin');
/* const VaccinationCentre = require('../models/Admin'); */

const adminController = {

    signup: async (req, res) => {
        const { name, email, password, role } = req.body;
    
        try {
          // Check if the email is already registered
          const existingAdmin = await Admin.findOne({ email });
    
          if (existingAdmin) {
            return res.status(409).json({ error: 'Email already registered' });
          }
    
          // Create a new admin
          const newAdmin = new Admin({ name, email, password, role });
    
          // Save the admin to the database
          await newAdmin.save();
    
          // Remove the password from the response for security reasons
          newAdmin.password = undefined;
    
          return res.status(201).json(newAdmin);
        } catch (error) {
          console.error('Error while signing up as admin:', error);
          res.status(500).json({ error: 'Server error' });
        }
      },
    
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check if the admin exists with the provided email
      const admin = await Admin.findOne({ email });

      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      // Check if the password is correct
      if (admin.password !== password) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Admin login successful
      return res.status(200).json({ message: 'Login successful', admin });
    } catch (error) {
      console.error('Error while logging in as admin:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  addVaccinationCentres: async (req, res) => {
    const { adminId, name, start ,end } = req.body;

    try {
      // Check if the admin exists
      const admin = await Admin.findById(adminId);

      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      // Add a new vaccination centre
      admin.vaccinationCentre.push({ name, start ,end  });

      await admin.save();

      return res.status(201).json({ message: 'Vaccination centre added successfully', admin });
    } catch (error) {
      console.error('Error while adding vaccination centre:', error);
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
