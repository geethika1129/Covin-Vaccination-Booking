const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    centre: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre', required: true }, // Reference to the Centre model
    date: { type: Date, required: true },
    slotTime: { type: String, required: true },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;