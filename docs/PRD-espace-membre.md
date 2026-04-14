# PRD - Espace Membre AFMEF.bj

## Vue d'ensemble

### Contexte
L'AFMEF (Amicale des Femmes du Ministère en charge des Finances) compte 500+ membres actives et souhaite digitaliser l'expérience membre via un espace dédié sur le site afmef.bj.

### Objectif
Créer un espace membre authentifié permettant aux adhérentes d'accéder à des ressources exclusives, de consulter l'annuaire, de gérer leur profil et de s'inscrire aux événements.

### Périmètre V1
| Inclus | Exclus (V2+) |
|--------|--------------|
| Authentification WordPress | Paiement cotisations en ligne |
| Gestion de profil | Messagerie interne |
| Documents exclusifs | Forum de discussion |
| Annuaire des membres | Application mobile |
| Calendrier & inscription événements | Notifications push |

---

## Architecture technique

### Stack
- **Frontend**: SvelteKit (existant)
- **Backend/Auth**: WordPress REST API + JWT
- **Gestion des données**: WordPress avec custom post types et user meta
- **Hébergement**: Vercel (existant)

### Authentification
```
[SvelteKit] <---> [WordPress REST API + JWT Auth Plugin]
                         |
                  [Base utilisateurs WordPress]
```

**Plugin WordPress requis**: JWT Authentication for WP REST API

---

## Fonctionnalités détaillées

### 1. Authentification & Inscription

#### 1.1 Connexion
- **Endpoint**: `POST /wp-json/jwt-auth/v1/token`
- **Champs**: Email + Mot de passe
- **Stockage token**: localStorage/cookies sécurisés
- **Session**: Persistante avec refresh token

#### 1.2 Inscription
- **Workflow**:
  1. Membre remplit formulaire d'inscription
  2. Demande envoyée à WordPress (statut: "en attente")
  3. Admin valide dans WordPress
  4. Membre reçoit email de confirmation

- **Champs requis**:
  - Nom complet
  - Email professionnel
  - Téléphone
  - Direction/Service au Ministère
  - Numéro matricule (optionnel)
  - Photo de profil

#### 1.3 Récupération mot de passe
- Email de réinitialisation via WordPress
- Lien sécurisé avec token temporaire

---

### 2. Tableau de bord membre

#### 2.1 Vue d'ensemble
```
┌─────────────────────────────────────────────────────────┐
│  Bienvenue, [Prénom]                        [Photo]     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Profil     │  │  Documents   │  │  Annuaire    │  │
│  │   ────────   │  │  ─────────   │  │  ────────    │  │
│  │   Gérer      │  │   15 docs    │  │  500+ membres│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  Événements  │  │  Cotisation  │                    │
│  │  ──────────  │  │  ──────────  │                    │
│  │  3 à venir   │  │  À jour ✓    │                    │
│  └──────────────┘  └──────────────┘                    │
│                                                         │
│  PROCHAINS ÉVÉNEMENTS                                   │
│  ├─ 15 Fév - Atelier leadership (Inscrite ✓)           │
│  ├─ 28 Fév - Journée solidarité                        │
│  └─ 08 Mar - Célébration 8 mars                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 2.2 Informations affichées
- Statut cotisation (à jour / en retard)
- Nombre de documents disponibles
- Événements à venir avec statut d'inscription
- Notifications récentes

---

### 3. Gestion de profil

#### 3.1 Informations personnelles
| Champ | Modifiable | Type |
|-------|------------|------|
| Nom complet | Oui | Texte |
| Email | Non* | Email |
| Téléphone | Oui | Tel |
| Photo de profil | Oui | Image |
| Direction/Service | Oui | Select |
| Poste/Fonction | Oui | Texte |
| Date d'adhésion | Non | Date |
| Numéro membre | Non | Auto |

*Modification email nécessite validation admin

#### 3.2 Paramètres de confidentialité
- Visibilité dans l'annuaire (Oui/Non)
- Afficher téléphone aux autres membres (Oui/Non)
- Afficher email aux autres membres (Oui/Non)

#### 3.3 Sécurité
- Changement de mot de passe
- Déconnexion de tous les appareils

---

### 4. Documents exclusifs

#### 4.1 Catégories de documents
- **Statuts & Règlements**: Documents fondateurs de l'AFMEF
- **Rapports d'activités**: Bilans annuels, comptes-rendus
- **Formations**: Supports des ateliers et séminaires
- **Ressources RH**: Guides, codes, lois pertinentes
- **Newsletters**: Archives des communications

#### 4.2 Fonctionnalités
- Recherche par titre/catégorie
- Filtrage par catégorie
- Prévisualisation PDF (pdfjs existant)
- Téléchargement direct
- Indicateur "Nouveau" pour docs récents

#### 4.3 Gestion WordPress
- Custom Post Type: `document_membre`
- Taxonomie: `categorie_document`
- ACF fields: fichier PDF, date publication, catégorie
- Accès restreint via rôle "membre_afmef"

---

### 5. Annuaire des membres

#### 5.1 Vue liste
```
┌─────────────────────────────────────────────────────────┐
│  ANNUAIRE DES MEMBRES                    [Recherche...] │
├─────────────────────────────────────────────────────────┤
│  Filtrer par: [Direction ▼] [Fonction ▼] [Année ▼]      │
├─────────────────────────────────────────────────────────┤
│  ┌────┐  Mme Vicentia AKOTO OKRY                        │
│  │ 📷 │  Présidente en exercice                         │
│  └────┘  Direction Générale                             │
│          ✉ [Contacter]                                  │
├─────────────────────────────────────────────────────────┤
│  ┌────┐  Mme Awaou BACO                                 │
│  │ 📷 │  Présidente fondatrice                          │
│  └────┘  Direction du Budget                            │
│          ✉ [Contacter]                                  │
└─────────────────────────────────────────────────────────┘
```

#### 5.2 Informations visibles
- Photo de profil
- Nom complet
- Direction/Service
- Fonction/Poste
- Année d'adhésion
- Coordonnées (si autorisées par le membre)

#### 5.3 Recherche & filtres
- Recherche par nom
- Filtre par direction
- Filtre par année d'adhésion
- Pagination (20 membres/page)

#### 5.4 Respect de la vie privée
- Seuls les membres visibles dans l'annuaire apparaissent
- Coordonnées masquées selon préférences
- Pas d'export de données

---

### 6. Calendrier & Événements

#### 6.1 Types d'événements
- Ateliers de formation
- Assemblées générales
- Actions sociales
- Célébrations (8 mars, anniversaire AFMEF)
- Réunions du bureau

#### 6.2 Vue calendrier
```
┌─────────────────────────────────────────────────────────┐
│        ◀  FÉVRIER 2026  ▶           [Vue: Mois | Liste] │
├─────────────────────────────────────────────────────────┤
│  Lun   Mar   Mer   Jeu   Ven   Sam   Dim                │
│                                                         │
│                          1     2                        │
│   3     4     5     6     7     8     9                 │
│                                [●]                      │
│  10    11    12    13    14   [●]    16                 │
│                               15                        │
│  17    18    19    20    21    22    23                 │
│                                                         │
│  24    25    26    27   [●]    29                       │
│                         28                              │
└─────────────────────────────────────────────────────────┘

[●] = Événement prévu
```

#### 6.3 Détail événement
- Titre et description
- Date, heure, lieu
- Organisateur
- Nombre de places (si limité)
- Liste des inscrites (optionnel)
- Bouton inscription/désinscription
- Ajout au calendrier personnel (iCal)

#### 6.4 Gestion des inscriptions
- Inscription en un clic
- Confirmation par email
- Rappel 24h avant (email)
- Liste d'attente si complet

#### 6.5 Gestion WordPress
- Custom Post Type: `evenement_afmef`
- Champs ACF: date, heure, lieu, places, image
- Gestion inscriptions via user meta

---

### 7. Statut cotisation (lecture seule V1)

#### 7.1 Affichage
- Badge "À jour" / "En retard" sur le dashboard
- Historique des cotisations payées
- Montant annuel: 10 000 FCFA

#### 7.2 V1 - Gestion manuelle
- Admin met à jour le statut dans WordPress
- Membre consulte uniquement son statut

#### 7.3 V2 - Paiement en ligne (futur)
- Intégration MTN MoMo / Moov Money
- Paiement par carte via Fedapay/Paystack
- Reçu automatique par email

---

## Structure des routes SvelteKit

```
/espace-membre
├── /                     → Dashboard (tableau de bord)
├── /connexion            → Page de connexion
├── /inscription          → Formulaire d'inscription
├── /mot-de-passe-oublie  → Récupération mot de passe
├── /profil               → Gestion du profil
├── /documents            → Liste des documents
├── /documents/[slug]     → Détail document (prévisualisation)
├── /annuaire             → Liste des membres
├── /annuaire/[id]        → Profil public d'un membre
├── /evenements           → Calendrier des événements
├── /evenements/[slug]    → Détail événement + inscription
└── /cotisation           → Statut et historique cotisations
```

---

## Modèle de données WordPress

### Custom Post Types

#### `document_membre`
```json
{
  "title": "Rapport d'activités 2025",
  "categorie": "rapports",
  "fichier_pdf": "url_du_fichier.pdf",
  "date_publication": "2025-12-15",
  "description": "Bilan complet des activités..."
}
```

#### `evenement_afmef`
```json
{
  "title": "Atelier Leadership Féminin",
  "date": "2026-02-15",
  "heure_debut": "09:00",
  "heure_fin": "16:00",
  "lieu": "Salle de conférence MEF",
  "description": "Formation intensive...",
  "places_max": 50,
  "inscriptions": ["user_id_1", "user_id_2"]
}
```

### User Meta (membres)
```json
{
  "direction": "Direction Générale du Budget",
  "fonction": "Chef Service",
  "matricule": "123456",
  "date_adhesion": "2023-01-15",
  "numero_membre": "AFMEF-2023-042",
  "cotisation_status": "a_jour",
  "cotisation_derniere": "2025-12-01",
  "visible_annuaire": true,
  "afficher_telephone": true,
  "afficher_email": false
}
```

### Rôle WordPress
- Nouveau rôle: `membre_afmef`
- Capabilities: lecture des documents et événements membres
- Gestion via plugin Members ou code custom

---

## Sécurité

### Authentification
- JWT avec expiration (7 jours)
- Refresh token pour renouvellement
- HTTPS obligatoire
- Protection CORS configurée

### Autorisation
- Vérification du rôle `membre_afmef` côté API
- Middleware SvelteKit pour pages protégées
- Redirection vers /connexion si non authentifié

### Protection des données
- Pas de stockage de mots de passe côté frontend
- Données sensibles non exposées dans l'API publique
- Conformité RGPD (droit à l'oubli, export données)

---

## Livrables techniques

### Phase 1 - Infrastructure (Semaine 1-2)
- [ ] Installation plugin JWT Auth sur WordPress
- [ ] Configuration CORS WordPress
- [ ] Création du rôle `membre_afmef`
- [ ] Service d'authentification SvelteKit
- [ ] Middleware de protection des routes
- [ ] Pages connexion/inscription/mot de passe oublié

### Phase 2 - Profil & Dashboard (Semaine 3)
- [ ] Custom fields utilisateur WordPress
- [ ] API endpoints profil membre
- [ ] Dashboard membre SvelteKit
- [ ] Page profil avec édition
- [ ] Paramètres de confidentialité

### Phase 3 - Documents (Semaine 4)
- [ ] CPT `document_membre` + taxonomie
- [ ] API endpoint documents (filtrage par rôle)
- [ ] Page liste documents avec filtres
- [ ] Prévisualisation PDF (réutiliser composant existant)
- [ ] Téléchargement sécurisé

### Phase 4 - Annuaire (Semaine 5)
- [ ] API endpoint liste membres (avec filtres confidentialité)
- [ ] Page annuaire avec recherche/filtres
- [ ] Page profil public membre
- [ ] Pagination et performance

### Phase 5 - Événements (Semaine 6)
- [ ] CPT `evenement_afmef` + champs ACF
- [ ] API endpoints événements
- [ ] Vue calendrier + liste
- [ ] Système d'inscription
- [ ] Notifications email (inscription/rappel)

### Phase 6 - Tests & Lancement (Semaine 7-8)
- [ ] Tests fonctionnels complets
- [ ] Tests de sécurité
- [ ] Documentation utilisateur
- [ ] Formation admin WordPress
- [ ] Mise en production
- [ ] Onboarding premiers membres

---

## Métriques de succès

| Métrique | Objectif V1 |
|----------|-------------|
| Taux d'adoption | 50% des membres inscrites en 3 mois |
| Connexions mensuelles | 200+ connexions/mois |
| Documents consultés | 100+ téléchargements/mois |
| Inscriptions événements | 80% via plateforme |
| Satisfaction utilisateur | NPS > 40 |

---

## Évolutions futures (V2+)

### Paiement cotisations
- Intégration MTN MoMo / Moov Money
- Reçus automatiques
- Rappels automatiques avant échéance

### Communication
- Messagerie privée entre membres
- Forum de discussion
- Notifications push

### Mobile
- Application mobile (React Native ou PWA)
- Notifications push natives

### Analytics
- Dashboard admin avec statistiques
- Rapports d'engagement
- Export données pour rapports

---

## Annexes

### A. Plugins WordPress recommandés
1. **JWT Authentication for WP REST API** - Authentification
2. **Advanced Custom Fields PRO** - Champs personnalisés
3. **Members** - Gestion des rôles
4. **WP Mail SMTP** - Emails transactionnels fiables

### B. Références design
- Conserver la charte graphique existante (couleurs jade/or)
- Composants UI cohérents avec le site public
- Mobile-first pour toutes les pages

### C. Contacts projet
- **Product Owner**: [À définir]
- **Tech Lead**: [À définir]
- **Admin WordPress**: [À définir]
