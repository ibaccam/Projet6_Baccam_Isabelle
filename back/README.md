
Construire une API sécurisée pour l'application d'avis gastronomiques So Pekocko


### Contexte du projet

Piiquante se dédie à la création de sauces épicées dont les recettes sont gardées secrètes. 
Pour tirer parti de son succès et générer davantage de buzz, l'entreprise souhaite créer une application web dans laquelle les utilisateurs peuvent ajouter
leurs sauces préférées et liker ou disliker les sauces ajoutées par les autres.


### Compétences évaluées

Mettre en œuvre des opérations CRUD de manière sécurisée
Implémenter un modèle logique de données conformément à la réglementation
Stocker des données de manière sécurisée


### Tâches réalisées

* Configuration de l'environnement de développement, avec toutes les dépendances requises pour démarrer ;

* Création d'un serveur Node et utilisé pour servir une application Express.

* Connexion de l'application à une base de données MongoDB et, à l'aide de Mongoose,création d' une API RESTful permettant les opérations CRUD (Create, Read, Update and Delete, soit Créer, Lire, Modifier et Supprimer).

* Création de routes et implémentation de CORS pour s'assurer que le front-end pouvait effectuer des appels vers l'application en toute sécurité.

* Ajout d' un modèle de données User afin de stocker les informations utilisateur dans la base de données.

* Implémentation du cryptage de mot de passe sécurisé afin de stocker en toute sécurité les mots de passe utilisateur.

* Implémentation d'une authentification sécurisée à base du token JWT au front-end pour authentifier les requêtes

* Ajout du middleware d'authentification pour sécuriser les routes dans votre API. De cette façon, seules les requêtes authentifiées seront gérées.

* Implémentation de la gestion du téléchargement de fichiers, permettant ainsi aux utilisateurs d'ajouter et de supprimer des images.


### Contenus de ce repository

* Ce repo contient les deux dossiers `Frontend` et `Backend`.

### Installation

* Cloner ce projet depuis GitHub.

### Faire tourner le Frontend

* Ouvrir le terminal sur le dossier et exécuter  `npm install` pour installer les dépendances.
* Executer `npm run start` pour avoir accès au serveur de développement.
* Accès `http://localhost:4200`.

### Faire tourner le Backend

* Ouvrir le terminal sur ce dossier.
* Pour utiliser le serveur, chargez le package nodemon : `npm install -g nodemon`.
* Puis lancez le serveur: `nodemon server
* Accès`http://localhost:3000/api`


### Si les packages sont déja installés, ces commandes suffisent à démarrer les serveurs.

* `npm run start via le terminal sur le frontend
* `nodemon server` via le terminal sur le backend
* Se connecter à l'url : `http://localhost:4200`

### Connexion

* Ouvrir [localhost:4200](http://localhost:4200/) dans votre navigateur.


#### Utilisé dans ce projet

| Technologies             | et outils          |
|:------------------------:|:------------------:|
| Framework: Express       | Visual Studio Code |
| Serveur: NodeJS          | Git/GitHub         |
| Base de données: MongoDB | Mongoose           |
| Javascript               |                 |

* Hébergement de la base de données sur MongoDB Atlas
* Toutes les opérations de la base de données utilisent le pack Mongoose
 Le package Mongoose facilite les interactions entre votre application Express et votre base de données MongoDB
 'npm install mongoose'
 Import de mongoose dans le fichier app.js en ajoutant la constante suivante : const mongoose = require('mongoose');


### API REST

* Sécurité **OWASP** et **RGPD**


### API ROUTES
Toutes les routes sauce pour les sauces doivent disposer d’une autorisation (le token est envoyé par le front-end avec l'en-tête d’autorisation : « Bearer <token> »).
Avant que l'utilisateur puisse apporter des modifications à la route sauce, le code doit vérifier si l'userId actuel correspond à l'userId de la sauce. Si l'userId ne
correspond pas, renvoyer « 403: unauthorized request. » Cela permet de s'assurer que seul le propriétaire de la sauce peut apporter des modifications à celle-ci.

### Data ModelsSauce

* userId : String — l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
* name : String — nom de la sauce
* manufacturer : String — fabricant de la sauce
* description : String — description de la sauce
* mainPepper : String — le principal ingrédient épicé de la sauce
* imageUrl : String — l'URL de l'image de la sauce téléchargée par l'utilisateur
* heat : Number — nombre entre 1 et 10 décrivant la sauce
* likes : Number — nombre d'utilisateurs qui aiment (= likent) la sauce
* dislikes : Number — nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce
* usersLiked : [ "String <userId>" ] — tableau des identifiants des utilisateurs qui ont aimé (= liked) la sauce
* usersDisliked : [ "String <userId>" ] — tableau des identifiants des utilisateurs qui n'ont pas aimé (= disliked) la sauce

  
### Utilisateur
* email : String — adresse e-mail de l'utilisateur [unique]
* password : String — mot de passe de l'utilisateur haché
  
  
### Exigences de sécurité
* Le mot de passe de l'utilisateur doit être haché.
* L'authentification doit être renforcée sur toutes les routes sauce requises.
* Les adresses électroniques dans la base de données sont uniques et un plugin Mongoose approprié est utilisé pour garantir leur unicité et signaler les erreurs.
* La sécurité de la base de données MongoDB (à partir d'un service tel que MongoDB Atlas) ne doit pas empêcher l'application de se lancer sur la machine d'un utilisateur.
* Un plugin Mongoose doit assurer la remontée des erreurs issues de la base de données.
* Les versions les plus récentes des logiciels sont utilisées avec des correctifs de sécurité actualisés.
* Le contenu du dossier images ne doit pas être téléchargé sur GitHub.
  
***
