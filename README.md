# Spotify Remember
Permet de créer chaque mois sur Spotify une playlist **Musiques découvertes le MOIS/ANNEE** afin de pouvoir réécouter plusieurs années plus tard des musiques oubliées.

## Prérequis
- Avoir une base de données **Postgres**

## Installation

1. Récupérer le code source du projet


2. Créer une application sur le dashboard développeur de Spotify : https://developer.spotify.com/dashboard/applications


3. Créer à la racine un fichier `.env` sur le même modèle que `.env.example` puis remplir ce fichier


4. Ajouter une redirect URI sur l'application via le dashboard Spotify : `host:port/spotify/callback`


5. Exécuter `npm install`

### Développement

6. Exécuter `npm run prisma:migrate` pour migrer la base de données


7. Démarrer l'application `npm run dev` 


8. Pour enregistrer son compte Spotify dans l'application, accéder
au site via l'url `{host}:{port}/spotify/login`

### Production

6. Exécuter `npm run start` pour lancer la migration de données puis l'application


7. Accéder au site lancé avec cet url `{host}:{port}/spotify/login` puis accepter
