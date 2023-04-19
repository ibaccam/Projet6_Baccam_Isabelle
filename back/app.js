//CONTENU DE L'APPLICATION//


// Application EXPRESS //

const express = require('express'); //appel de express

const app = express(); //permet de créer l'application express


// Base de données MONGOOSE//
const mongoose = require('mongoose'); // Importer mongoose  en ajoutant la constante suivante

mongoose.connect('mongodb+srv://User_1:User_1@atlascluster.dmcq2lm.mongodb.net/?retryWrites=true&w=majority', // Se connecter à la base de données
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// CORS //
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


//Pour gérer la requête POST venant de l'application front-end, on a besoin d'en extraire le corps JSON.
//Donc utilisation d'un middleware mis à disposition par le framework Express:
app.use(express.json());

/////////////////////////////
module.exports = app;