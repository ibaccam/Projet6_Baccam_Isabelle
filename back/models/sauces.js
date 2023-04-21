/*------------------------------------------------
    Modèle sauce
--------------------------------------------------*/

const mongoose = require("mongoose"); // import mongoose pour créer un schéma

// Création du schéma des données sauces - type et caractère (obligatoire ou non)
// Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
});

module.exports = mongoose.model("Sauce", sauceSchema); // export du schéma sous forme de modèle, le rendant par là même disponible pour notre application Express.