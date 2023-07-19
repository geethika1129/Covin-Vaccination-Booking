const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  vaccinationSlots: [
    {
      vaccinationCentre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VaccinationCentre'
      },
      slotDate: {
        type: Date,
        required: true
      }
    }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
