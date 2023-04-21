/*----------------------------------------------------------------------------------
    MULTER
    un package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP
    Type et emplacement des fichiers images
------------------------------------------------------------------------------------*/

const multer = require('multer');

const MIME_TYPES = { // Constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée.
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Nous créons une constante storage , à passer à multer comme configuration, qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants :
const storage = multer.diskStorage({  // Méthode diskStorage() configure le chemin et le nom de fichier pour les fichiers entrants.
  destination: (req, file, callback) => {  // La fonction destination indique à multer d'enregistrer les fichiers dans le dossier images ;
    callback(null, 'images');
  },
  filename: (req, file, callback) => {  // La fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp 
    const name = file.originalname.split(' ').join('_'); // Pour élminier les espaces
    const extension = MIME_TYPES[file.mimetype];  
    callback(null, name + Date.now() + '.' + extension); // Création du nom de fichier avec timestamp Date.now() 
  }
});

// export du middleware : avec Appel de la méthode multer dans laquelle on passe l'objet storage et appel de la méthode single pour un fichier unique de type image
module.exports = multer({storage: storage}).single('image'); 