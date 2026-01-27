# Mosolo Cop WebApp

Une application web moderne développée avec **React + Django REST API** pour la gestion des utilisateurs, groupes et dépôts financiers.  
Ce projet vise à offrir une plateforme transparente et configurable où l’administrateur peut définir les règles globales (pénalités, frais mensuels, éligibilité au crédit) et gérer les membres.

 Démo en ligne : [Mosolo Cop WebApp](https://mosolo-copwebapp.vercel.app/#/)

---

##  Fonctionnalités principales

- **Authentification sécurisée** avec JWT (login, refresh token).
- **Gestion des utilisateurs** :
  - Création, suspension, réactivation.
  - Mise à jour du profil et des informations personnelles.
  - Dépôts financiers avec historique.
- **Gestion des groupes** :
  - Création et recherche de groupes.
  - Ajout et retrait de membres.
  - Montant de dépôt configurable par groupe.
- **Configuration globale (SystemConfig)** :
  - Pourcentage de pénalité journalière.
  - Nombre de mois requis pour l’éligibilité au crédit.
  - Frais mensuels en pourcentage.
- **Éligibilité au crédit** :
  - Vérification automatique selon les règles définies par l’admin.
- **Tableau de bord admin** :
  - Liste des utilisateurs actifs/suspendus.
  - Résumé des transactions récentes.
  - Gestion centralisée des paramètres.

---

##  Technologies utilisées

- **Frontend** : React, TypeScript, Axios, TailwindCSS
- **Backend** : Django, Django REST Framework
- **Auth** : djangorestframework-simplejwt
- **Base de données** : PostgreSQL / SQLite (selon environnement)
- **Déploiement** : Vercel (frontend), Django (backend API)

---

## Installation locale

### 1. Cloner le projet
```bash
git clone https://github.com/ton-compte/mosolo-copwebapp.git
cd mosolo-copwebapp
