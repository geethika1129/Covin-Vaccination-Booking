const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin']
  },
  /* vaccinationCentres: [
    {
      name: {
        type: String,
        required: true
      },
      start: {
        type: Date,
        required: true
      },
      end: {
        type: Date,
        required: true
      },
      slots:{
        type :Number,
        required :true

      }

    }
  ] */
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
