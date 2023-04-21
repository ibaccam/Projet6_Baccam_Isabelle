const express = require('express');   // Appel de express
const auth = require("../middleware/auth") // appel du middleware pour protéger les routes
const router = express.Router(); // Création du router avec express


const saucesCtrl = require('../controllers/sauces'); // appel du controller pour associer les fonctions aux differents routes





module.exports = router;