// Un fichier de contrôleur exporte des méthodes qui sont ensuite attribuées aux routes pour améliorer la maintenabilité de votre application.
// Logique métier à chaque route

// Import Modèle sauces
const sauce = require('../models/sauces');

// Import Module 'file system' de Node : donne accès aux fonctions qui nous permettent de modifier le système de fichiers, ou supprimer les fichiers
const fs = require('fs');



/*------------------------------------------------
    GETALLSAUCE
    Récuperer toutes les sauces de la base
--------------------------------------------------*/
exports.getAllSauce = (req, res, next) => {
  // On utilise la méthode find pour obtenir la liste complète des sauces trouvées dans la base
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({
      error
    }));
};


/*------------------------------------------------
    GETONESAUCE
    Accèder à une sauce
--------------------------------------------------*/
exports.getOneSauce = (req, res, next) => {
  // On utilise la méthode findOne avec l'objet de comparaison, on veut que l'id de la sauce soit le même que le paramètre de requête
  Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};


/*------------------------------------------------
    CREATESAUCE
    Créer une nouvelle sauce
--------------------------------------------------*/
exports.createSauce = (req, res, next) => {
  // Données envoyées par le front-end sous forme de chaines de caractères à transformer en objet sous forme de JSON
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id; // On supprime l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB
  delete sauceObject._userId; // Par sécurité : Nous supprimons le champ_userId de la requête pour eviter que qq'un crée un objet à son nom et le modifie pour le réassigner à quelqu'un d'aurte
  const sauce = new Sauce({ // Création de l'objet Sauce
    ...sauceObject,
    userId: req.auth.userId, // Nous le remplaçons en base de données par le _userId extrait du token par le middleware d’authentification.
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // On génère l'URL de l'image pour avoir l'URL complète
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  // Sauvegarde de la sauce dans la base de données
  sauce.save()
      .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})}) // promesse : On envoi une réponse au frontend avec un statut 201 sinon on a une expiration de la requête
      .catch(error => { res.status(400).json( { error })}) // On ajoute un code erreur en cas de problème
};
  


/*------------------------------------------------
    MODIFYSAUCE
    Modifier une nouvelle sauce
--------------------------------------------------*/

//Nous devons prendre en compte deux possibilités : l'utilisateur a mis à jour l'image ou pas.
//Dans le premier cas, nous recevrons l'élément form-data et le fichier. Dans le second cas, nous recevrons uniquement les données JSON.

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {     // On crée un objet sauceObject qui regarde si req.file existe ou non.  ; 
        ...JSON.parse(req.body.sauce), // S'il existe, on traite la nouvelle image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; // S'il n'existe pas, on traite simplement l'objet entrant, on récupère directement l'objet dans le corps de la requête
  
    delete sauceObject._userId; // Par sécurité : Nous supprimons le champ_userId de la requête pour eviter que qq'un crée un objet à son nom et le modifie pour le réassigner à quelqu'un d'aurte
    Sauce.findOne({_id: req.params.id}) // On récupère l'objet dans la base de données
        .then((sauce) => { // Il faut aussi nous assurer que la personne demandant la modification de l’objet est la propriétaire de celui-ci.
            if (sauce.userId != req.auth.userId) { 
                res.status(401).json({ message : 'Non-autorisé'}); 
            } else {
                sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id}) // si oui, on crée ensuite une instance Sauce à partir de sauceObject, puis on effectue la modification
                .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };
  
  
/*------------------------------------------------
    DELETESAUCE
    Supprimer une sauce
--------------------------------------------------*/
// Il y a deux points auxquels nous devons faire attention lors de la suppression d’une sauce 
// Nous devons nous assurer que la personne qui en fait la requête est bien celle qui a créé la sauce. 
// Puis en ce qui concerne la gestion des fichiers dans notre back-end
// => il faut absolument nous assurer qu’à chaque suppression d'une sauce de la base de données, le fichier image correspondant est également supprimé.

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id}) // On récupère l'objet en base de données, en utilisant l'ID reçu
      .then(sauce => {                 
          if (sauce.userId != req.auth.userId) {  // Nous vérifions si l’utilisateur qui a fait la requête de suppression est bien celui qui a créé la sauce
              res.status(401).json({message: 'Not authorized'}); // Si non, on envoie une erreur
          } else {                     // si propriétaire :
              const filename = sauce.imageUrl.split('/images/')[1]; // on récupère le nom de fichier grâce à split dans le répertoire images
              fs.unlink(`images/${filename}`, () => {  // on utilise la fonction unlink du package fs pour supprimer ce fichier
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

  
/*------------------------------------------------
    LIKESAUCE
    Liker ou disliker une sauce
--------------------------------------------------*/


exports.likeSauce = (req, res, next) => {
 
  
  let like = req.body.like       // Pour récupérer le like dans le body
  let userId = req.body.userId   // Pour récupérer le userID dans le body
  let sauceId = req.params.id    // Pour récupérer l'ID de la sauce dans le body

  
  // Si le user a mis un like 
  if (like === 1) { 
    Sauce.updateOne({_id: sauceId}, // On met à jour la sauce
      {   
        $push: {usersLiked: userId}, // en pushant l'utilisateur 
        $inc: {likes: +1}, // et on incrémente le compteur likes de 1
      })
      .then(() => res.status(200).json({message: 'Like ajouté !'}))
      .catch((error) => res.status(400).json({error}))
  }

  // Si le user a mis un dislike 
  if (like === -1) {
    Sauce.updateOne({_id: sauceId}, // On met à jour la sauce
      {
        $push: {usersDisliked: userId}, // en pushant l'utilisateur 
        $inc: {dislikes: +1}, // On incrémentele compteur dislikes de 1
      })
      .then(() => res.status(200).json({message: 'Dislike ajouté !'}))
      .catch((error) => res.status(400).json({error}))
  }

  // Si le user annule un like ou un dislike

  if (like === 0) { 
    Sauce.findOne({_id: sauceId}) // On récupère l'objet en base de données, en utilisant l'ID reçu
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) { // Si le userID est dans la liste des usersliked, c'est qu'il annule un Like
          Sauce.updateOne({_id: sauceId}, // On met à jour la sauce
            {
              $pull: {usersLiked: userId}, // en supprimant le userID du tableau
              $inc: {likes: -1}, // Et on incrémente de -1
            })
            .then(() => res.status(200).json({message: 'Like retiré !'}))
            .catch((error) => res.status(400).json({error}))
        }
        if (sauce.usersDisliked.includes(userId)) { // Si le userID est dans la liste des usersDisliked, c'est qu'il annule un Dislike
          Sauce.updateOne({_id: sauceId}, // On met à jour la sauce
            {
              $pull: {usersDisliked: userId}, // en supprimant le userID du tableau
              $inc: {dislikes: -1}, // On incrémente de -1
            })
            .then(() => res.status(200).json({message: 'Dislike retiré !'}))
            .catch((error) => res.status(400).json({error}))
        }
      })
      .catch((error) => res.status(404).json({error}))
  }
}
