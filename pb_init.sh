#!/bin/sh
# Script d'initialisation PocketBase
# Attend que PocketBase soit prêt puis crée les collections manquantes via l'API admin

PB_URL="http://localhost:8090"
ADMIN_EMAIL="${PB_ADMIN_EMAIL:-admin@afmef.bj}"
ADMIN_PASSWORD="${PB_ADMIN_PASSWORD:-AdminAfmef2026!}"

echo "[pb_init] Attente de PocketBase..."
until wget -qO- "$PB_URL/api/health" > /dev/null 2>&1; do
    sleep 1
done
echo "[pb_init] PocketBase est prêt."

# Créer le compte admin si nécessaire (premier lancement)
echo "[pb_init] Vérification du compte admin..."
ADMIN_CHECK=$(wget -qO- "$PB_URL/api/admins" 2>&1)
if echo "$ADMIN_CHECK" | grep -q '"totalItems":0'; then
    echo "[pb_init] Création du compte admin..."
    wget -qO- --post-data="{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\",\"passwordConfirm\":\"$ADMIN_PASSWORD\"}" \
        --header="Content-Type: application/json" \
        "$PB_URL/api/admins" > /dev/null 2>&1
fi

# Authentification admin
echo "[pb_init] Authentification admin..."
AUTH_RESPONSE=$(wget -qO- --post-data="{\"identity\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
    --header="Content-Type: application/json" \
    "$PB_URL/api/admins/auth-with-password" 2>&1)

TOKEN=$(echo "$AUTH_RESPONSE" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')

if [ -z "$TOKEN" ]; then
    echo "[pb_init] ERREUR: Impossible de s'authentifier en admin. Abandon."
    exit 0
fi

echo "[pb_init] Authentifié. Vérification des collections..."

# Fonction pour vérifier si une collection existe
collection_exists() {
    CODE=$(wget -qO- --header="Authorization: $TOKEN" \
        -S "$PB_URL/api/collections/$1" 2>&1 | grep "HTTP/" | tail -1 | awk '{print $2}')
    [ "$CODE" = "200" ]
}

# Fonction pour créer une collection
create_collection() {
    NAME="$1"
    JSON="$2"
    if collection_exists "$NAME"; then
        echo "[pb_init] Collection '$NAME' existe déjà."
    else
        echo "[pb_init] Création de la collection '$NAME'..."
        wget -qO- --post-data="$JSON" \
            --header="Content-Type: application/json" \
            --header="Authorization: $TOKEN" \
            "$PB_URL/api/collections" > /dev/null 2>&1
        echo "[pb_init] Collection '$NAME' créée."
    fi
}

# === Collections de contenu ===

create_collection "type_activites" '{
    "name": "type_activites",
    "type": "base",
    "schema": [
        {"name": "name", "type": "text", "required": true},
        {"name": "slug", "type": "text", "required": true}
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null
}'

create_collection "activites" '{
    "name": "activites",
    "type": "base",
    "schema": [
        {"name": "title", "type": "text", "required": true},
        {"name": "slug", "type": "text", "required": true},
        {"name": "content", "type": "editor"},
        {"name": "excerpt", "type": "text"},
        {"name": "date", "type": "date", "required": true},
        {"name": "image", "type": "file", "options": {"maxSelect": 1, "maxSize": 5242880, "mimeTypes": ["image/jpeg","image/png","image/webp"]}},
        {"name": "imageAlt", "type": "text"},
        {"name": "types", "type": "relation", "options": {"collectionId": "type_activites", "maxSelect": null}}
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null
}'

create_collection "ressources" '{
    "name": "ressources",
    "type": "base",
    "schema": [
        {"name": "title", "type": "text", "required": true},
        {"name": "slug", "type": "text", "required": true},
        {"name": "description", "type": "text"},
        {"name": "date", "type": "date"},
        {"name": "fichier", "type": "file", "options": {"maxSelect": 1, "maxSize": 10485760}},
        {"name": "fichierType", "type": "text"}
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null
}'

# === Collections espace membre ===
# Note : la collection "users" est créée automatiquement par PocketBase (auth)
# On doit ajouter les champs custom après la création

echo "[pb_init] Mise à jour des champs custom de la collection 'users'..."
# PocketBase crée automatiquement la collection users, on vérifie juste qu'elle existe
if collection_exists "_pb_users_auth_"; then
    echo "[pb_init] Collection 'users' existe. Les champs custom doivent être ajoutés via l'admin UI."
fi

create_collection "events" '{
    "name": "events",
    "type": "base",
    "schema": [
        {"name": "title", "type": "text", "required": true},
        {"name": "slug", "type": "text", "required": true},
        {"name": "description", "type": "editor"},
        {"name": "date", "type": "date", "required": true},
        {"name": "endDate", "type": "date"},
        {"name": "location", "type": "text"},
        {"name": "image", "type": "file", "options": {"maxSelect": 1, "maxSize": 5242880}},
        {"name": "maxParticipants", "type": "number"}
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": null,
    "deleteRule": null
}'

create_collection "event_registrations" '{
    "name": "event_registrations",
    "type": "base",
    "schema": [
        {"name": "event", "type": "relation", "required": true, "options": {"collectionId": "events", "maxSelect": 1}},
        {"name": "user", "type": "relation", "required": true, "options": {"collectionId": "_pb_users_auth_", "maxSelect": 1}},
        {"name": "registeredAt", "type": "autodate", "options": {"onCreate": true, "onUpdate": false}}
    ],
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": null,
    "deleteRule": null
}'

create_collection "cotisations" '{
    "name": "cotisations",
    "type": "base",
    "schema": [
        {"name": "user", "type": "relation", "required": true, "options": {"collectionId": "_pb_users_auth_", "maxSelect": 1}},
        {"name": "year", "type": "number", "required": true},
        {"name": "amount", "type": "number", "required": true},
        {"name": "status", "type": "select", "options": {"values": ["pending", "paid"]}},
        {"name": "paidAt", "type": "date"},
        {"name": "method", "type": "select", "options": {"values": ["mobile_money", "virement", "especes", "kkiapay"]}},
        {"name": "transactionId", "type": "text"}
    ],
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null
}'

create_collection "documents" '{
    "name": "documents",
    "type": "base",
    "schema": [
        {"name": "title", "type": "text", "required": true},
        {"name": "description", "type": "text"},
        {"name": "file", "type": "file", "required": true, "options": {"maxSelect": 1, "maxSize": 10485760}},
        {"name": "category", "type": "select", "options": {"values": ["rapport", "pv", "formation", "autre"]}}
    ],
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null
}'

echo "[pb_init] Initialisation terminée."
