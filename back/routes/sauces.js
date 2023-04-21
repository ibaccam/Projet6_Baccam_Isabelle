//La méthode express.Router() vous permet de créer des routeurs séparés pour chaque route principale de votre application
//vous y enregistrez ensuite les routes individuelles.
//Un fichier de contrôleur exporte des méthodes qui sont ensuite attribuées aux routes pour améliorer la maintenabilité de votre application.


const express = require('express');   // Appel de express
const router = express.Router(); // Création du router avec express
const auth = require("../middleware/auth") // appel du middleware pour protéger les routes
const multer = require('../middleware/multer-config'); // import de multer à ajouter entre auth et gestion de la route (controllers)
const saucesCtrl = require('../controllers/sauces'); // appel du controller pour associer les fonctions aux differents routes / logique métier à chaque route

/*------------------------------------------------
    Routes sauces
--------------------------------------------------*/

//Enregistrement des routes dans notre routeur et application des contrôleurs aux routes

// requetes get pour la récupération de toutes les sauces
router.get("/", auth, saucesCtrl.getAllSauce); // simplification par "/" car enregistrement de notre routeur pour toutes les demandes effectuées vers /api/sauces sur app.js

// requete post pour la creation de sauce
router.post("/", auth, multer, saucesCtrl.createSauce);

// requetes get pour la récupération d'une sauce identifiée
router.get("/:id", auth, saucesCtrl.getOneSauce);

// requetes put pour la modification/mise à jour de sauce
router.put("/:id", auth, multer, saucesCtrl.modifySauce);

// requetes delete pour la suppression d'une sauce
router.delete("/:id", auth, saucesCtrl.deleteSauce);

// requete post de like pour la gestion des likes
router.post("/:id/like", auth, saucesCtrl.likeSauce);


module.exports = router;