
// Import de bcrypt dans notre controleur
const bcrypt = require('bcrypt');

// Import de token dans notre controleur
const jwt = require('jsonwebtoken');

// Modèle user
const User = require('../models/user');



//2 méthodes/fonctions//middleware

// Enregistrer des nouveaux utilisateurs //

// Implémenter la fonction signup
exports.signup = (req, res, next) => {   

    bcrypt.hash(req.body.password, 10)  // Appel de la fonction de hachage de bcrypt dans le mdp // fonction asynchrone
//nous créons un utilisateur
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
// et l'enregistrons dans la base de données, en renvoyant une réponse de réussite en cas de succès, et des erreurs avec le code d'erreur en cas d'échec. 
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Connecter les utilisateurs existants //

// Implémenter la fonction login
// Vérifier si un utilisateur qui tente de se connecter dispose d'identifiants valides
exports.login = (req, res, next) => { 
    User.findOne({ email: req.body.email }) // vérifier si l'utilisateur a été retrouvé (email renseigné)
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'}); // si pas enregistré
        }
        bcrypt.compare(req.body.password, user.password) // si user enregistré, on compare avec la base de données le mdp et la valeur retournée
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' }); // si ko
                }
                res.status(200).json({ // si mdp correct, on retourne un code 200 avec un objet qui va contenir les infos nécessaires à l'autentification des requêtes qui seront émises par notre client (userId et token)
                    // Nous renvoyons le token au front-end avec notre réponse
                    userId: user._id, // objet id
                    token: jwt.sign(  // utilisation de la fonction sign de jsonwebtoken pour chiffrer un nouveau token
                        { userId: user._id }, // ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token) // encodage de l'user id pour la création de nouveaux objets, sera utilisé pour appliquer le bon user id à chaque objet pour qu on ne puisse pas modifier l'objet des autres utilisateurs 
                                            //Cela permet de s'assurer que seul le propriétaire de la sauce peut apporter des modifications à celle-ci.
                        'RANDOM_TOKEN_SECRET', // nous utilisons une chaîne secrète de développement temporaire pour crypter notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production)
                        { expiresIn: '24h' } // nous définissons la durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures.
                    )
                });
            })
            .catch(error => res.status(500).json({ error })); // si erreur de traitement
    })
    .catch(error => res.status(500).json({ error })); // si requête n'est pas passée, erreur de traitement
};

