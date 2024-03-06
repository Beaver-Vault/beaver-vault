# This script should only be used in production if the Watchtower container fails to pull and update the containers.
docker compose -f docker-compose-prod.yml pull
docker compose -f docker-compose-prod.yml up -d