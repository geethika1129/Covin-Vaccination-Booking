const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');

// User Routes
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.get('/vaccination-centres', userController.searchVaccinationCentres);
router.post('/book', userController.applyForVaccinationSlot);
router.post('/logout', userController.logout);

module.exports = router;