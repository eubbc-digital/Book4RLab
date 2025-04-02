#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Function to check for Docker Compose command
check_docker_compose() {
  if command -v docker-compose &>/dev/null; then
    echo "docker-compose"
  elif command -v docker &>/dev/null && docker compose version &>/dev/null; then
    echo "docker compose"
  else
    echo "[x] Error: Docker Compose is not installed."
    exit 1
  fi
}

docker_compose_cmd=$(check_docker_compose)

echo -e "\n[BUILDING DOCKER IMAGE]\n"
$docker_compose_cmd build

echo -e "\n[RUNNING DATABASE MIGRATIONS]\n"
$docker_compose_cmd run --rm app python manage.py makemigrations
$docker_compose_cmd run --rm app python manage.py migrate

STATICFILES_DIR="./app/staticfiles/"
if [ ! -d "$STATICFILES_DIR" ]; then
  echo -e "\nStatic files directory does not exist."
  echo -e "Creating...\n"
  $docker_compose_cmd run --rm app python manage.py collectstatic
fi

echo -e "\n[RUNNING THE APPLICATION]\n"
$docker_compose_cmd up
