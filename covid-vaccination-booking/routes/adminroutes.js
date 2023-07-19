const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller');

// Admin Routes
router.post('/login', adminController.login);
router.post('/vaccination-centres', adminController.addVaccinationCentres);
router.get('/dosage-details', adminController.getDosageDetails);
router.delete('/vaccination-centres/:id', adminController.removeVaccinationCentre);

module.exports = router;
