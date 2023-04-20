const express = require('express');   // Appel de express
const router = express.Router(); // Création du router avec express


const userCtrl = require('../controllers/user'); // controllers pour associer les fonctions aux differents routes

// Création de 2 routes post cra le font-end va envoyer les informations
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router; // exporter le routeur