const mongoose = require('mongoose');

const centreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  slotsAvailable: {
    type: Number,
    required: true
  },
  
});

const Centre = mongoose.model('Centre', centreSchema);

module.exports = Centre;
