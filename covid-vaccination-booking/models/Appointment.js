const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    user: { type: String,  required: true }, // Reference to the User model
    centre: { type: String,  required: true }, // Reference to the Centre model
    date: { type: Date, required: true },
    
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;