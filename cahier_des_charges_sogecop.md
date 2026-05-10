# Cahier des Charges — Système Web SOGECOP
**Société Générale de Commerce et de Prestations (SOGECOP Sarl)**
Version 1.3 — Mai 2025

---

## 1. Présentation du projet

### 1.1 Contexte
SOGECOP Sarl est une entreprise burkinabè spécialisée dans quatre domaines : l'imprimerie générale, la fourniture de consommables et matériels informatiques, le négoce international, et l'aménagement d'espaces intérieurs et extérieurs.

L'entreprise souhaite mettre en place un système web composé d'une vitrine publique bilingue (français / anglais) et d'un outil interne de gestion et de suivi des commandes réservé aux agents, accessible en permanence au bureau même en cas de coupure internet.

### 1.2 Objectifs
- Offrir une présence en ligne professionnelle et bilingue à travers une page publique
- Permettre aux agents d'enregistrer et de suivre les commandes des clients en interne
- Garantir la disponibilité du système au bureau même en cas de coupure internet (via serveur local)
- Générer des documents commerciaux (pro forma et facture définitive) directement depuis le système
- Fournir à l'administrateur un tableau de bord de gestion globale, accessible depuis l'extérieur
- Améliorer la qualité et la traçabilité du service
- Assurer un suivi comptable des entrées et sorties d'argent de la structure
- Permettre au responsable de piloter la santé financière de l'entreprise en temps réel

### 1.3 Périmètre
Le système couvre trois espaces distincts :

- **Espace public** — vitrine bilingue (FR/EN) accessible à tous les visiteurs, incluant une galerie de réalisations
- **Espace agent** — interface interne de gestion des commandes avec génération de documents (accès restreint)
- **Espace administrateur** — tableau de bord de supervision globale avec module comptabilité

Les clients ne passent pas de commandes en ligne. La commande est enregistrée par un agent au sein de la structure lors d'une prise en charge physique ou téléphonique.

---

## 2. Parties prenantes

| Rôle | Description |
|---|---|
| Propriétaire / Directeur | Valide les décisions, accède au tableau de bord admin depuis le bureau ou l'extérieur |
| Agent | Enregistre et suit les commandes, génère les documents commerciaux |
| Visiteur / Client | Consulte la page publique (FR/EN), soumet une demande de renseignements |
| Développeur | Conçoit, développe et maintient le système |

---

## 3. Stack technique

| Composant | Technologie |
|---|---|
| Backend | Laravel (PHP) |
| Frontend | React (via Inertia.js ou API REST) |
| Base de données | MySQL |
| ORM | Eloquent (Laravel) |
| Authentification | Laravel Sanctum / Breeze — connexion par pseudo + mot de passe |
| Hébergement distant | VPS (DigitalOcean, Contabo ou OVH) + nom de domaine |
| Serveur local (LAN) | Mini serveur bureau (matériel à acquérir) — même stack Laravel/MySQL |
| Synchronisation | Laravel Scheduler — sync bidirectionnelle toutes les 5 minutes |
| Génération de documents | Laravel DomPDF ou similaire pour export PDF |

---

## 4. Architecture du système

### 4.1 Architecture applicative

```
/
├── Page publique (visiteurs — FR / EN)
│   ├── Accueil / Hero
│   ├── À propos
│   ├── Services
│   ├── Réalisations (galerie photos / vidéos)
│   └── Contact / Formulaire de renseignements
│
├── /login
│   └── Connexion agents & admin (pseudo + mot de passe)
│
├── /dashboard (agents)
│   ├── Liste des commandes
│   ├── Nouvelle commande
│   ├── Détail commande
│   ├── Mise à jour statut
│   ├── Génération pro forma
│   └── Génération facture définitive
│
└── /admin (administrateur)
    ├── Tableau de bord global
    ├── Gestion des agents
    ├── Statistiques commandes
    ├── Historique général
    └── /admin/comptabilite
        ├── Vue entrées / sorties
        ├── Nouvelle transaction
        ├── Statistiques financières (mensuel / annuel)
        └── Commandes non soldées
```

### 4.2 Architecture réseau cible

```
Bureau SOGECOP (réseau local)
├── Mini serveur local (LAN)
│   ├── Laravel + MySQL (même codebase que le VPS)
│   ├── Accessible via IP locale : http://192.168.x.x
│   ├── Fonctionne sans internet (usage quotidien des agents)
│   └── Sync bidirectionnelle toutes les 5 min quand internet disponible
│
└── Connexion internet (occasionnelle / parfois indisponible)
    │
    └── VPS distant (nom de domaine)
        ├── Laravel + MySQL distant
        ├── Page publique accessible à tous
        └── Tableau de bord admin accessible depuis l'extérieur
```

> **Note :** Le matériel du serveur local (mini serveur bureau) n'est pas encore acquis. Le développement démarre sur le VPS distant. L'installation locale sera effectuée en Phase 2 une fois le matériel disponible. La codebase est identique pour les deux environnements.

---

## 5. Synchronisation des données

### 5.1 Principe général

Le serveur local (LAN) est le point de travail principal des agents au bureau. Le VPS distant est le serveur de référence externe, accessible depuis l'extérieur par le propriétaire. La synchronisation est **bidirectionnelle** : les données créées ou modifiées d'un côté sont répliquées de l'autre.

```
Serveur local  ──────────────────────────────▶  VPS distant
(agents bureau)     sync toutes les 5 min       (admin externe)
               ◀──────────────────────────────
```

### 5.2 Mécanisme de synchronisation

- Un **job Laravel Scheduler** s'exécute toutes les 5 minutes sur chaque serveur
- Avant chaque sync, le système vérifie la disponibilité de la connexion internet
- Seules les données modifiées depuis la dernière sync sont transmises (sync différentielle)
- Chaque enregistrement des tables critiques dispose d'un champ `synced_at` et `updated_at`
- En cas de modification simultanée du même enregistrement des deux côtés, la règle **"le plus récent gagne"** s'applique (basée sur `updated_at`) — les risques de conflits réels sont faibles dans ce contexte

### 5.3 Tables concernées par la synchronisation

- `commandes`, `lignes_commande`, `versements`, `clients`, `documents`
- `historique_commandes`, `transactions`
- `users` (sync des comptes agents créés/modifiés côté admin)

### 5.4 Indicateur de statut de synchronisation

Un indicateur visuel permanent est affiché dans l'interface agent et admin pour informer de l'état de la synchronisation :

| État | Affichage |
|---|---|
| 🟢 Synchronisé | "Synchronisé — il y a 2 min" |
| 🟡 Sync en cours | "Synchronisation en cours…" |
| 🔴 Hors ligne | "Hors ligne — dernière sync il y a X min" |

L'indicateur est discret (coin de l'interface) et ne bloque pas l'utilisation du système.

### 5.5 Phases de déploiement

**Phase 1 — Développement & production initiale (VPS uniquement)**
- L'application est développée et déployée sur le VPS avec le nom de domaine
- Les champs `synced_at` sont intégrés dès le départ dans le modèle de données
- Le mécanisme de sync est développé mais inactif (un seul nœud)

**Phase 2 — Mise en place du serveur local (après acquisition du matériel)**
- Installation de la même application Laravel/MySQL sur le mini serveur bureau
- Activation de la synchronisation bidirectionnelle
- Les agents basculent sur l'accès IP locale — aucun changement pour eux côté interface

---

## 6. Fonctionnalités détaillées

### 6.1 Page publique

| Fonctionnalité | Description |
|---|---|
| Bilinguisme FR / EN | Bascule de langue (français / anglais) sur l'ensemble de la page publique |
| Section Hero | Accroche, slogan, boutons d'action |
| À propos | Présentation de SOGECOP, valeurs |
| Services | Détail des 4 domaines d'activité |
| Galerie de réalisations | Section dédiée présentant les travaux passés sous forme de photos et/ou vidéos, organisée par catégorie de service |
| Formulaire de contact | Nom, email, service concerné, message — envoi par email |
| Informations de contact | Adresse, téléphone, email, horaires |
| Responsive design | Adaptation mobile, tablette, desktop |

> **Note :** La maquette de la page publique a été fournie par le client et servira de base de référence. La section Réalisations sera intégrée en cohérence avec le design validé. Des précisions complémentaires seront apportées par le client au moment de l'intégration.

### 6.2 Espace agent (interne)

| Fonctionnalité | Description |
|---|---|
| Authentification | Connexion par pseudo + mot de passe |
| Enregistrement de commande | Saisie : client, service, lignes de commande, montants, délai, priorité |
| Liste des commandes | Filtrage par statut, service, date |
| Détail d'une commande | Consultation de toutes les informations, statut de paiement, historique des versements |
| Mise à jour du statut | EN_ATTENTE → EN_COURS → TERMINE / ANNULE |
| Génération de pro forma | Édition et export PDF d'un document pro forma (devis estimatif) pour le client |
| Génération de facture définitive | Édition et export PDF de la facture finale après validation de la commande |
| Enregistrement d'un versement | Saisie du montant versé par le client (versement 1, 2, 3…) avec date et référence |
| Indicateur de sync | Affichage permanent de l'état de synchronisation avec le serveur distant |
| Historique des actions | Traçabilité des modifications par agent |
| Profil agent | Consultation et modification du profil (nom, prénom, pseudo, email) |

**Statuts d'une commande :**

- `EN_ATTENTE` — commande enregistrée, non traitée
- `EN_COURS` — commande prise en charge
- `TERMINE` — commande livrée et clôturée
- `ANNULE` — commande annulée

**Statuts de paiement d'une commande :**

- `NON_PAYE` — aucun versement enregistré
- `PARTIEL` — versement(s) partiel(s) enregistré(s)
- `PAYE` — commande entièrement soldée

### 6.3 Module de génération de documents commerciaux

Le système permet de générer deux types de documents PDF directement depuis la fiche commande.

#### 6.3.1 Pro forma (devis estimatif)

Le pro forma est un document commercial préliminaire destiné à estimer le coût d'une commande pour un client (notamment institutionnel). Il n'engage pas définitivement la transaction.

| Champ | Détail |
|---|---|
| En-tête du document | Service abrégé + Mois + Numéro séquentiel (ex : IMP-MAI-001) |
| Informations client | Nom complet, organisation, contact |
| Détail des lignes | Désignation, quantité, prix unitaire, sous-total par ligne |
| Délai de livraison | Sélection : 1 à 20 jours **ou** saisie manuelle libre |
| Remise | Sélection : 20%, 30%, 50% **ou** saisie manuelle libre |
| Montant brut | Total avant remise |
| Montant net (après remise) | Total après application de la remise |
| Total HT | Montant net hors taxe |
| TVA (18%) | Calculée automatiquement sur le montant net HT |
| Total TTC | Total HT + TVA |
| Acompte demandé | Sélection : 0%, 50%, 70%, 100% **ou** saisie manuelle libre |
| Reste à payer | Calculé automatiquement : Total TTC − Acompte |
| Pied de page | Conditions, validité du pro forma, signature |

#### 6.3.2 Facture définitive

La facture définitive est émise après validation et livraison de la commande. Elle reprend la même structure que le pro forma avec, en plus, l'historique complet des versements.

| Champ | Détail |
|---|---|
| En-tête du document | Service abrégé + Mois + Numéro séquentiel |
| Informations client | Nom complet, organisation, contact |
| Détail des lignes | Désignation, quantité, prix unitaire, sous-total par ligne |
| Remise appliquée | Taux et montant de la remise |
| Montant brut | Total avant remise |
| Montant net (après remise) | Total après remise |
| Total HT | Montant net hors taxe |
| TVA (18%) | Calculée automatiquement |
| Total TTC | Total HT + TVA |
| Historique des versements | Liste ordonnée : Versement 1, Versement 2… avec date, montant et référence |
| Total versé | Cumul de tous les versements enregistrés |
| Solde restant dû | Total TTC − Total versé |
| Pied de page | Conditions de paiement, cachet, signature |

> **Note :** Un exemplaire de reçu existant a été fourni par le client et servira de base graphique pour la modernisation du design des documents générés.

#### 6.3.3 Numérotation des documents

| Service | Préfixe | Exemple |
|---|---|---|
| Imprimerie | IMP | IMP-MAI-001 |
| Informatique | INFO | INFO-JAN-012 |
| Négoce | NEG | NEG-OCT-005 |
| Aménagement | AMEN | AMEN-DEC-003 |

Le mois est exprimé en 3 lettres majuscules. Le numéro est séquentiel sur 3 chiffres, remis à zéro chaque année.

### 6.4 Tableau de bord administrateur

| Fonctionnalité | Description |
|---|---|
| Vue globale | Nombre de commandes par statut, par service, par période |
| Gestion des agents | Créer, modifier, désactiver un compte agent |
| Historique complet | Accès à toutes les commandes tous agents confondus |
| Statistiques commandes | Commandes par mois, par service, taux de complétion |
| Indicateur de sync | Affichage de l'état de synchronisation entre serveur local et VPS |

### 6.5 Module comptabilité (admin uniquement)

| Fonctionnalité | Description |
|---|---|
| Tableau entrées / sorties | Liste de toutes les transactions avec filtres (type, catégorie, période) |
| Nouvelle transaction | Enregistrement manuel d'une entrée ou sortie d'argent |
| Solde net | Calcul automatique entrées − sorties sur une période choisie |
| Chiffre d'affaires | Total des encaissements mensuel et annuel |
| Commandes non soldées | Liste des commandes terminées avec paiement partiel ou nul |
| Statistiques financières | Courbe de revenus mensuelle, dépenses par catégorie |
| Validation des encaissements | L'admin valide ou rejette les versements saisis par les agents (à confirmer avec le responsable) |

---

## 7. Logique de calcul des documents commerciaux

| Étape | Libellé | Formule |
|---|---|---|
| 1 | **Montant brut** | Somme des sous-totaux de toutes les lignes |
| 2 | **Remise** | 20%, 30%, 50% ou saisie libre → Montant remise = Brut × Taux |
| 3 | **Montant net HT** | Brut − Montant remise |
| 4 | **TVA (18%)** | Montant net HT × 18% |
| 5 | **Total TTC** | Montant net HT + TVA |
| 6 | **Acompte** | 0%, 50%, 70%, 100% ou saisie libre → Acompte = TTC × Taux |
| 7 | **Reste à payer** | Total TTC − Acompte |
| 8 | **Total versé** *(facture)* | Cumul de tous les versements enregistrés |
| 9 | **Solde restant dû** *(facture)* | Total TTC − Total versé |

**Règles de saisie :**
- **Délai de livraison** : liste de 1 à 20 jours, avec option de saisie manuelle libre
- **Remise** : valeurs prédéfinies 20%, 30%, 50% ; saisie manuelle libre pour tout autre taux
- **Acompte** : valeurs prédéfinies 0%, 50%, 70%, 100% ; saisie manuelle libre pour tout autre montant

---

## 8. Modèle de données

### Table `users`
| Champ | Type | Description |
|---|---|---|
| id | BIGINT UNSIGNED AI | Identifiant unique |
| nom | VARCHAR(100) | Nom de l'agent |
| prenom | VARCHAR(100) | Prénom de l'agent |
| pseudo | VARCHAR(50) | Identifiant de connexion (unique) |
| email | VARCHAR(150) | Email de l'agent (unique) |
| password | VARCHAR(255) | Hash bcrypt |
| role | ENUM | `AGENT`, `ADMIN` |
| actif | TINYINT(1) | Compte actif ou désactivé |
| synced_at | TIMESTAMP | Date de dernière synchronisation |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Dernière modification |

### Table `clients`
| Champ | Type | Description |
|---|---|---|
| id | BIGINT UNSIGNED AI | Identifiant unique |
| nom_complet | VARCHAR(200) | Nom complet du client |
| telephone | VARCHAR(30) | Numéro de téléphone |
| email | VARCHAR(150) | Email du client |
| organisation | VARCHAR(200) | Entreprise / institution |
| synced_at | TIMESTAMP | Date de dernière synchronisation |
| created_at | TIMESTAMP | Date d'enregistrement |
| updated_at | TIMESTAMP | Dernière modification |

### Table `commandes`
| Champ | Type | Description |
|---|---|---|
| id | BIGINT UNSIGNED AI | Identifiant unique |
| reference | VARCHAR(30) | Référence unique (ex : CMD-2025-0001) |
| client_id | BIGINT UNSIGNED | FK → clients |
| agent_id | BIGINT UNSIGNED | FK → users |
| service | ENUM | `IMPRIMERIE`, `INFORMATIQUE`, `NEGOCE`, `AMENAGEMENT` |
| description | TEXT | Détail général de la commande |
| statut | ENUM | `EN_ATTENTE`, `EN_COURS`, `TERMINE`, `ANNULE` |
| priorite | ENUM | `NORMALE`, `URGENTE` |
| montant_brut | DECIMAL(15,2) | Total avant remise (FCFA) |
| remise_taux | DECIMAL(5,2) | Taux de remise appliqué (%) |
| montant_remise | DECIMAL(15,2) | Montant de la remise (FCFA) |
| montant_net_ht | DECIMAL(15,2) | Montant après remise, hors TVA |
| tva_montant | DECIMAL(15,2) | Montant TVA à 18% |
| montant_ttc | DECIMAL(15,2) | Total TTC |
| montant_verse | DECIMAL(15,2) | Total des versements enregistrés |
| statut_paiement | ENUM | `NON_PAYE`, `PARTIEL`, `PAYE` |
| delai_livraison | VARCHAR(50) | Délai en jours ou texte libre |
| date_commande | TIMESTAMP | Date d'enregistrement |
| date_echeance | DATE | Date de livraison prévue |
| notes | TEXT | Remarques internes |
| synced_at | TIMESTAMP | Date de dernière synchronisation |
| updated_at | TIMESTAMP | Dernière modification |

### Table `lignes_commande`
| Champ | Type | Description |
|---|---|---|
| id | BIGINT UNSIGNED AI | Identifiant unique |
| commande_id | BIGINT UNSIGNED | FK → commandes |
| designation | VARCHAR(255) | Description de l'article / prestation |
| quantite | DECIMAL(10,2) | Quantité |
| prix_unitaire | DECIMAL(15,2) | Prix unitaire en FCFA |
| sous_total | DECIMAL(15,2) | Quantité × Prix unitaire (calculé) |
| ordre | INT | Ordre d'affichage dans le document |
| synced_at | TIMESTAMP | Date de dernière synchronisation |
| updated_at | TIMESTAMP | Dernière modification |

### Table `versements`
| Champ | Type | Description |
|---|---|---|
| id | BIGINT UNSIGNED AI | Identifiant unique |
| commande_id | BIGINT UNSIGNED | FK → commandes |
| agent_id | BIGINT UNSIGNED | FK → users |
| numero_versement | INT | Numéro d'ordre (1, 2, 3…) |
| montant | DECIMAL(15,2) | Montant du versement en FCFA |
| date_versement | DATE | Date réelle du versement |
| reference | VARCHAR(100) | Référence (reçu, virement, etc.) |
| notes | TEXT | Remarques éventuelles |
| statut_validation | ENUM | `EN_ATTENTE`, `VALIDE`, `REJETE` |
| valide_par | BIGINT UNSIGNED | FK → users (admin, nullable) |
| synced_at | TIMESTAMP | Date de dernière synchronisation |
| created_at | TIMESTAMP | Date de saisie |
| updated_at | TIMESTAMP | Dernière modification |

### Table `documents`
| Champ | Type | Description |
|---|---|---|
| id | BIGINT UNSIGNED AI | Identifiant unique |
| commande_id | BIGINT UNSIGNED | FK → commandes |
| agent_id | BIGINT UNSIGNED | FK → users |
| type | ENUM | `PRO_FORMA`, `FACTURE` |
| reference | VARCHAR(30) | Référence du document (ex : IMP-MAI-001) |
| chemin_fichier | VARCHAR(500) | Chemin du PDF généré |
| synced_at | TIMESTAMP | Date de dernière synchronisation |
| created_at | TIMESTAMP | Date de génération |

### Table `historique_commandes`
| Champ | Type | Description |
|---|---|---|
| id | BIGINT UNSIGNED AI | Identifiant unique |
| commande_id | BIGINT UNSIGNED | FK → commandes |
| agent_id | BIGINT UNSIGNED | FK → users |
| ancien_statut | ENUM | Statut avant modification |
| nouveau_statut | ENUM | Statut après modification |
| commentaire | TEXT | Commentaire de l'agent |
| synced_at | TIMESTAMP | Date de dernière synchronisation |
| created_at | TIMESTAMP | Date de l'action |

### Table `transactions`
| Champ | Type | Description |
|---|---|---|
| id | BIGINT UNSIGNED AI | Identifiant unique |
| reference | VARCHAR(30) | Référence unique (ex : TXN-2025-0001) |
| type | ENUM | `ENTREE`, `SORTIE` |
| categorie | VARCHAR(100) | Ex : Paiement commande, Loyer, Salaire… |
| montant | DECIMAL(15,2) | Montant en FCFA |
| commande_id | BIGINT UNSIGNED | FK → commandes (nullable) |
| description | TEXT | Détail de l'opération |
| statut_validation | ENUM | `EN_ATTENTE`, `VALIDE`, `REJETE` |
| valide_par | BIGINT UNSIGNED | FK → users (nullable) |
| date_transaction | DATE | Date réelle de l'opération |
| agent_id | BIGINT UNSIGNED | FK → users |
| synced_at | TIMESTAMP | Date de dernière synchronisation |
| created_at | TIMESTAMP | Date de saisie |
| updated_at | TIMESTAMP | Dernière modification |

---

## 9. Sécurité

- Authentification par pseudo + mot de passe (pas d'email requis à la connexion)
- Mots de passe hashés avec bcrypt
- Accès `/dashboard` et `/admin` protégés par middleware Laravel
- Rôles vérifiés côté serveur à chaque requête
- Variables d'environnement pour les clés sensibles (`.env`)
- Connexion MySQL via SSL en production
- Communication sécurisée entre serveur local et VPS (HTTPS / token d'API dédié)

---

## 10. Design & Interface

- Palette principale : vert foncé `#1a5c2a`, or `#c8a84b`, marron `#8B5E3C`, sable `#f7f3ed`
- Typographie : Cormorant Garamond (titres) + Outfit (corps)
- Design responsive (mobile-first)
- Interface interne sobre et fonctionnelle
- Page publique : design professionnel et élégant (validé en maquette)
- Documents PDF : design modernisé sur la base du reçu existant fourni par le client
- Indicateur de synchronisation : bandeau discret permanent dans l'interface agent et admin

---

## 11. Phases de développement

### Phase 1 — Mise en place (Semaine 1–2)
- Initialisation du projet Laravel + React
- Configuration MySQL local + migrations Eloquent (avec champs `synced_at`)
- Mise en place de l'authentification par pseudo (Laravel Sanctum/Breeze)
- Structure des routes et middlewares (protection par rôle)

### Phase 2 — Page publique (Semaine 3)
- Intégration de la maquette validée
- Mise en place du bilinguisme FR / EN
- Intégration de la section Réalisations (galerie photos / vidéos)
- Formulaire de contact fonctionnel
- Déploiement sur VPS avec nom de domaine

### Phase 3 — Espace agent (Semaine 4–5)
- Interface de liste et création de commandes (avec lignes)
- Gestion des statuts et historique
- Gestion des fiches clients
- Enregistrement des versements

### Phase 4 — Module documents (Semaine 6)
- Génération PDF pro forma (remise, délai, acompte, TVA)
- Génération PDF facture définitive (historique des versements)
- Système de numérotation par service et par mois
- Modernisation du design des documents sur base du reçu client

### Phase 5 — Tableau de bord admin (Semaine 7)
- Statistiques et vue globale des commandes
- Gestion des comptes agents

### Phase 6 — Module comptabilité (Semaine 8)
- Interface entrées / sorties et nouvelles transactions
- Statistiques financières mensuelles et annuelles
- Vue commandes non soldées
- Mécanisme de validation des versements (si retenu par le responsable)

### Phase 7 — Synchronisation (Semaine 9)
- Développement du job de sync bidirectionnelle (Laravel Scheduler)
- Indicateur de statut de synchronisation dans l'interface
- Tests de sync (connexion/déconnexion simulées)
- Documentation du protocole de sync pour la Phase 8

### Phase 8 — Tests & Déploiement final (Semaine 10)
- Tests fonctionnels complets
- Déploiement production sur VPS
- Variables d'environnement production

> **Phase 9 — Serveur local LAN (après acquisition du matériel)**
> Installation de l'application sur le mini serveur bureau, activation de la sync bidirectionnelle, bascule des agents sur l'accès IP locale. Cette phase est hors planning initial et sera planifiée séparément.

---

## 12. Contraintes et hypothèses

- Les clients ne se connectent pas à la plateforme — tout passe par les agents
- Le serveur local (LAN) n'est pas encore acquis — le développement démarre sur le VPS uniquement
- La codebase est identique pour le serveur local et le VPS (même application Laravel/MySQL)
- En cas de conflit de synchronisation, la règle "le plus récent gagne" (basée sur `updated_at`) s'applique
- Le formulaire de contact envoie un email de notification (pas de stockage en base dans un premier temps)
- Les montants sont exprimés en FCFA (Franc CFA ouest-africain)
- La TVA appliquée est de 18%
- La section Réalisations sera précisée par le client lors de la phase d'intégration
- Le mécanisme de validation des versements (approbation admin) est à confirmer avec le responsable
- L'envoi de notifications SMS/email sur changement de statut est prévu en version ultérieure
- Le module comptabilité est accessible uniquement à l'administrateur

---

## 13. Évolutions futures (hors périmètre v1)

- Notifications automatiques par email/SMS au changement de statut
- Catalogue de produits en ligne (imprimerie, informatique)
- Espace client avec suivi de commande autonome
- Devis en ligne
- Application mobile

---

*Document établi sur la base des informations fournies par SOGECOP Sarl*
*Version 1.3 — Mai 2025 — Mise à jour : architecture serveur local LAN + sync bidirectionnelle, authentification par pseudo, simplification modèle client (nom complet), champ `synced_at` sur toutes les tables critiques, indicateur de synchronisation dans l'interface*
*À valider par le propriétaire avant démarrage du développement*
