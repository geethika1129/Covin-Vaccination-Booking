const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller');

// Admin Routes
router.post('/signup', adminController.signup);
router.post('/login', adminController.login);
router.post('/add', adminController.addVaccinationCentres);
router.get('/dosage-details', adminController.getDosageDetails);
router.delete('/vaccination-centres/:id', adminController.removeVaccinationCentre);
router.post('/logout', adminController.logout);
router.get('/getVaccinationCentres', adminController.getVaccinationCentres);
router.delete('/deleteVaccinationCentre/:centreId', adminController.deleteVaccinationCentre);
router.get('/getDosageDetails', adminController.getDosageDetails);
module.exports = router;
