#!/bin/sh
# Entrypoint PocketBase : démarre le serveur puis lance l'initialisation

# Démarrer PocketBase en arrière-plan
/pb/pocketbase serve --http=0.0.0.0:8090 --dir=/pb/pb_data --migrationsDir=/pb/pb_migrations &
PB_PID=$!

# Lancer le script d'initialisation
sh /pb/pb_init.sh

# Attendre PocketBase (premier plan)
wait $PB_PID
