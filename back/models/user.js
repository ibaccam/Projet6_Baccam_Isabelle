/*------------------------------------------------
    Modèle d'utilisateur
--------------------------------------------------*/

// Implémenter l'authentification par e-mail et mot de passe 
 
const mongoose = require('mongoose'); // Import de Mongoose

// la valeur unique, avec l'élément mongoose-unique-validator passé comme plug-in, s'assurera que deux utilisateurs ne puissent partager la même adresse e-mail
// améliore les messages d'erreur lors de l'enregistrement de données uniques
const uniqueValidator = require('mongoose-unique-validator');

// Création du schéma des données user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email de type string et un champs obligatoire // unique = Pour s'assurer que 2 utilisateurs ne puissent pas utiliser la même adresse e-mail
  password: { type: String, required: true } // Nous stockerons le mot de passe de chaque utilisateur sous la forme d'un hash et champs requis
});

userSchema.plugin(uniqueValidator);// Appliquer le validator au schéma : on appelle la méthode plugin et validator en argument de cette méthode

module.exports = mongoose.model('User', userSchema); // export du schéma sous forme de modèle