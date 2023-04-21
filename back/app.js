/*------------------------------------------------
    CONTENU DE L'APPLICATION
--------------------------------------------------*/

/*------------------------------------------------
    Application EXPRESS
--------------------------------------------------*/

const express = require('express'); //appel de express

const app = express(); //permet de créer l'application express


/*------------------------------------------------
    Base de données
--------------------------------------------------*/

// Importer mongoose  en ajoutant la constante suivante
const mongoose = require('mongoose'); 

// Se connecter à la base de données
// Le package Mongoose facilite les interactions entre votre application Express et votre base de données MongoDB
mongoose.connect('mongodb+srv://User_1:User_1@atlascluster.dmcq2lm.mongodb.net/?retryWrites=true&w=majority', 
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


/*------------------------------------------------
    Chemin d'accès complet au fichier téléchargé / image
    Traiter les requêtes vers la route /image, en rendant notre dossier images statique.
--------------------------------------------------*/
const path = require('path');


  
/*------------------------------------------------
    Import routes
--------------------------------------------------*/

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');


/*------------------------------------------------
    CORS
--------------------------------------------------*/

// Un système de sécurité qui, par défaut, bloque les appels HTTP entre des serveurs différents, ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles
// Nous devons ajouter des headers à notre objet response 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Ces headers permettent d'accéder à notre API depuis n'importe quelle origine ( '*' ) 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).

  next(); // Le middleware Express reçoit également la méthode next , qui permet à chaque middleware de passer l'exécution au middleware suivant
});

/*------------------------------------------------
    Middleware 
--------------------------------------------------*/

//Créer une route POST
//Pour gérer la requête POST venant de l'application front-end, on a besoin d'en extraire le corps JSON.
//Donc utilisation d'un middleware mis à disposition par le framework Express:
app.use(express.json());

//Appel des Routes
app.use('/api/auth', userRoutes); // Appel de userRoutes
app.use("/api/sauces", saucesRoutes); // Appel de saucesRoutes => enregistrement de notre routeur pour toutes les demandes effectuées vers /api/sauces
app.use('/images', express.static(path.join(__dirname, 'images')));// Cela indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname) à chaque fois qu'elle reçoit une requête vers la route /images

/////////////////////////////
module.exports = app;