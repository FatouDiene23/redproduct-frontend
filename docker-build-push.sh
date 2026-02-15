#!/bin/bash

# Script de build et push Docker pour RedProduct Frontend
# Usage: ./docker-build-push.sh [votre-username-dockerhub] [nom-image] [tag]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Valeurs par défaut
DOCKER_USERNAME="${1:-your-dockerhub-username}"
IMAGE_NAME="${2:-redproduct-frontend}"
TAG="${3:-latest}"

echo -e "${YELLOW}=== Build et Push Docker Image ===${NC}"
echo -e "Username: ${GREEN}$DOCKER_USERNAME${NC}"
echo -e "Image: ${GREEN}$IMAGE_NAME${NC}"
echo -e "Tag: ${GREEN}$TAG${NC}"
echo ""

# Vérifier que l'utilisateur est connecté à Docker Hub
echo -e "${YELLOW}Vérification de la connexion Docker Hub...${NC}"
if ! docker info | grep -q "Username"; then
    echo -e "${RED}❌ Vous n'êtes pas connecté à Docker Hub!${NC}"
    echo -e "${YELLOW}Connexion à Docker Hub...${NC}"
    docker login
fi

# Build de l'image
echo -e "${YELLOW}Construction de l'image Docker...${NC}"
docker build -t $DOCKER_USERNAME/$IMAGE_NAME:$TAG .

# Tag supplémentaire avec la date
DATE_TAG=$(date +%Y%m%d-%H%M%S)
docker tag $DOCKER_USERNAME/$IMAGE_NAME:$TAG $DOCKER_USERNAME/$IMAGE_NAME:$DATE_TAG

echo -e "${GREEN}✅ Image construite avec succès!${NC}"
echo -e "Tags: ${GREEN}$TAG${NC} et ${GREEN}$DATE_TAG${NC}"

# Push vers Docker Hub
echo -e "${YELLOW}Push de l'image vers Docker Hub...${NC}"
docker push $DOCKER_USERNAME/$IMAGE_NAME:$TAG
docker push $DOCKER_USERNAME/$IMAGE_NAME:$DATE_TAG

echo -e "${GREEN}✅ Image pushée avec succès!${NC}"
echo ""
echo -e "${GREEN}=== Récapitulatif ===${NC}"
echo -e "Image disponible sur Docker Hub:"
echo -e "  ${GREEN}docker pull $DOCKER_USERNAME/$IMAGE_NAME:$TAG${NC}"
echo -e "  ${GREEN}docker pull $DOCKER_USERNAME/$IMAGE_NAME:$DATE_TAG${NC}"
echo ""
echo -e "Pour lancer le container localement:"
echo -e "  ${GREEN}docker run -d -p 80:80 $DOCKER_USERNAME/$IMAGE_NAME:$TAG${NC}"
echo ""
echo -e "${GREEN}✅ Terminé!${NC}"