# SOGECOP — Site vitrine & Gestion commerciale

Site vitrine public de **SOGECOP Sarl** (production & imprimerie numérique, fournitures informatiques, négoce international, aménagement intérieur & extérieur) couplé à une application interne de gestion commerciale : clients, commandes, versements, documents commerciaux (proforma, facture, bon de livraison) et suivi financier.

![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Sanctum](https://img.shields.io/badge/Auth-Sanctum-000000)
![mPDF](https://img.shields.io/badge/PDF-mPDF-8B0000)
![SQLite](https://img.shields.io/badge/DB-SQLite%2FMySQL-003B57?logo=sqlite&logoColor=white)

---

## Sommaire

- [Architecture](#architecture)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Démarrage](#démarrage)
- [Rôles et authentification](#rôles-et-authentification)
- [Modules fonctionnels](#modules-fonctionnels)
- [Cycle de vie d'une commande](#cycle-de-vie-dune-commande)
- [Aperçu de l'API](#aperçu-de-lapi)
- [Points de vigilance](#points-de-vigilance)
- [Licence](#licence)

---

## Architecture

```
Navigateur
    ↓
Frontend React (Vite) — vitrine publique + espaces agent/admin
    ↓  Axios — Bearer Token
API REST Laravel 13 — Sanctum
    ↓
Base de données (SQLite en local / MySQL en production)
```

Deux applications séparées dans ce dépôt : `frontend/` (site vitrine + interface de gestion en SPA React) et `backend/` (API Laravel), communiquant via des jetons Sanctum.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Backend | Laravel 13 (PHP 8.3) |
| Authentification | Laravel Sanctum (jetons API) |
| Base de données | SQLite (dev) / MySQL (prod) |
| Génération PDF | mPDF |
| Frontend | React 19 + Vite |
| Routing frontend | React Router v7 |
| HTTP client | Axios |

---

## Structure du projet

```
ttt/
├── backend/                          # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php        # Connexion par pseudo + mot de passe
│   │   │   ├── ClientController.php
│   │   │   ├── CommandeController.php    # Commandes + changement de statut
│   │   │   ├── VersementController.php   # Paiements échelonnés sur commande
│   │   │   ├── TransactionController.php # Mouvements financiers (recettes/dépenses)
│   │   │   ├── DocumentController.php    # Génération PDF (proforma/facture/BL)
│   │   │   ├── StatistiquesController.php
│   │   │   └── UserController.php        # Gestion des agents (admin)
│   │   └── Models/
│   │       ├── Client.php / Commande.php / LigneCommande.php
│   │       ├── Versement.php / Transaction.php / Document.php
│   │       └── HistoriqueCommande.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   │       └── AdminSeeder.php          # Crée le compte administrateur par défaut
│   └── routes/api.php
└── frontend/                          # SPA React — vitrine + back-office
    └── src/
        ├── api/ lib/axios.js           # Client Axios (VITE_API_URL)
        ├── context/AuthContext.jsx
        ├── hooks/ (useClients, useCommandes, ...)
        └── pages/
            ├── public/                 # Accueil, Services, À propos, Contact
            ├── auth/LoginPage.jsx
            ├── dashboard/              # Espace agent : commandes, clients, détail commande
            └── admin/                  # Espace admin : agents, transactions, statistiques, impayés
```

---

## Prérequis

- PHP 8.3+
- Composer
- Node.js 20+
- npm
- SQLite (par défaut) ou MySQL/PostgreSQL en production

---

## Installation

### 1. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Créer la base SQLite (par défaut) :

```bash
touch database/database.sqlite
php artisan migrate --seed
```

Le seeder `AdminSeeder` crée un compte administrateur par défaut (voir [Rôles et authentification](#rôles-et-authentification)).

> Pour utiliser MySQL/PostgreSQL en production, adapter les variables `DB_*` du `.env` avant la migration.

### 2. Frontend (React)

```bash
cd ../frontend
npm install
```

Le fichier `.env` du frontend pointe vers l'API locale :

```env
VITE_API_URL=http://localhost:8001/api
```

---

## Démarrage

```bash
# Terminal 1 — API Laravel (port 8001, requis par le frontend)
cd backend && php artisan serve --port=8001

# Terminal 2 — Frontend React
cd frontend && npm run dev
```

Frontend accessible sur `http://localhost:5173` — vitrine publique sur `/`, connexion sur `/login`.

### Compte par défaut

| Champ | Valeur |
|---|---|
| Pseudo | `admin` |
| Mot de passe | `sogecop2025` |

> ⚠️ Ce mot de passe est écrit en clair dans `database/seeders/AdminSeeder.php`. À changer immédiatement après la première connexion, et à ne jamais laisser tel quel dans un dépôt public.

---

## Rôles et authentification

Connexion par **pseudo** + mot de passe via Laravel Sanctum (jeton `Authorization: Bearer <token>`).

| Rôle | Accès frontend | Accès |
|---|---|---|
| `AGENT` | `/dashboard/*` | Ses propres commandes et clients, création de commandes, versements sur ses commandes |
| `ADMIN` | `/admin/*` | Tout ce que voit un agent + gestion des agents, transactions, statistiques, commandes non soldées |

Le contrôle d'accès est appliqué **au cas par cas dans certains contrôleurs** (`CommandeController`, `VersementController`, `DocumentController` restreignent un agent à ses propres commandes) plutôt que par un middleware de rôle global — voir [Points de vigilance](#points-de-vigilance).

---

## Modules fonctionnels

- **Site vitrine** — présentation de l'entreprise, des 4 domaines d'expertise, partenaires, formulaire de contact
- **Clients** — fiche client (nom, téléphone, email, adresse)
- **Commandes** — lignes de commande, calcul automatique du sous-total, remise (montant ou pourcentage), TVA optionnelle, échéance
- **Versements** — paiements échelonnés sur une commande, avec validation par un administrateur ; le montant payé et le statut de paiement (`NON_PAYE`/`PARTIEL`/`PAYE`) de la commande se recalculent automatiquement
- **Documents commerciaux** — génération PDF de pro forma, facture et bon de livraison via mPDF, téléchargement, historique des documents par commande
- **Transactions** — mouvements financiers (recettes/dépenses) liés ou non à une commande, avec validation
- **Statistiques** — vue annuelle des performances (réservée aux admins)
- **Commandes non soldées** — suivi des commandes avec solde restant dû (réservé aux admins)
- **Gestion des agents** — création de comptes, activation/désactivation, changement de rôle (réservé aux admins)
- **Historique des commandes** — journal des changements de statut par commande

---

## Cycle de vie d'une commande

1. Un agent crée une commande pour un client avec ses lignes d'articles → statut initial `EN_ATTENTE`
2. Un versement validé fait automatiquement passer la commande en `EN_COURS`
3. Lorsque le montant payé atteint le montant total, la commande passe automatiquement à `TERMINE`
4. Le statut peut aussi être changé manuellement (`EN_ATTENTE`, `EN_COURS`, `TERMINE`, `ANNULE`), sauf une fois `TERMINE` (verrouillé) ; `ANNULE` n'est jamais modifié automatiquement
5. À chaque étape, un pro forma, une facture ou un bon de livraison peut être généré en PDF

---

## Aperçu de l'API

Base URL : `http://localhost:8001/api`

### Authentification

| Méthode | Route | Description |
|---|---|---|
| POST | `/auth/login` | Connexion (`pseudo` + `password`) |
| GET | `/auth/me` | Utilisateur connecté |
| PUT | `/auth/me` | Mise à jour du profil / mot de passe |
| POST | `/auth/logout` | Déconnexion |

### Clients & commandes

| Méthode | Route | Description |
|---|---|---|
| GET/POST/PUT/DELETE | `/clients`, `/clients/{id}` | CRUD clients |
| GET/POST/PUT/DELETE | `/commandes`, `/commandes/{id}` | CRUD commandes |
| PATCH | `/commandes/{id}/statut` | Changer le statut d'une commande |

### Versements

| Méthode | Route | Description |
|---|---|---|
| GET | `/commandes/{id}/versements` | Liste des versements d'une commande |
| POST | `/commandes/{id}/versements` | Ajouter un versement |
| PUT/DELETE | `/commandes/{id}/versements/{id}` | Modifier / supprimer un versement |

### Documents

| Méthode | Route | Description |
|---|---|---|
| GET | `/commandes/{id}/documents` | Liste des documents générés |
| POST | `/commandes/{id}/documents/proforma` | Générer un pro forma |
| POST | `/commandes/{id}/documents/facture` | Générer une facture |
| POST | `/commandes/{id}/documents/bon-livraison` | Générer un bon de livraison |
| GET | `/commandes/{id}/documents/{id}/telecharger` | Télécharger un document |

### Finances & administration

| Méthode | Route | Description |
|---|---|---|
| GET/POST/PATCH/DELETE | `/transactions` | Mouvements financiers |
| GET | `/transactions/stats` | Statistiques des transactions |
| GET | `/statistiques/annuelles` | Statistiques annuelles |
| GET/POST/PUT/PATCH | `/agents` | Gestion des comptes agents/admin |

---

## Points de vigilance

Éléments constatés dans le code, à corriger avant mise en production :

- **Mot de passe admin en clair dans le dépôt** — `AdminSeeder.php` contient `sogecop2025` ; à changer et à ne pas versionner tel quel.
- **`/api/agents` (création, modification, activation/désactivation de comptes) n'est protégé par aucun contrôle de rôle** — `bootstrap/app.php` ne déclare aucun middleware, et `UserController` ne vérifie pas `isAdmin()`. En l'état, tout utilisateur authentifié (y compris un `AGENT`) peut créer ou modifier des comptes, y compris administrateurs. À corriger avec un middleware ou une vérification de rôle explicite.
- **`ClientController`, `StatistiquesController`, `TransactionController` ne filtrent pas par agent** — contrairement à `CommandeController`/`VersementController`/`DocumentController` qui restreignent un agent à ses propres commandes, ces ressources semblent accessibles à tout utilisateur connecté sans restriction de rôle.
- `config/dompdf.php` est présent mais dompdf n'est pas une dépendance déclarée dans `composer.json` (seul mPDF est utilisé) — fichier de configuration probablement obsolète, à supprimer si inutilisé.

---

## Licence

Projet propriétaire — © SOGECOP Sarl. Tous droits réservés.

---

*SOGECOP Sarl — Ouagadougou, Burkina Faso — 2026*
