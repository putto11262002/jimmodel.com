#!/bin/bash

# Set the Docker Compose project name and file
export docker_compose_project="jimmodel_dev"
export docker_compose_file="docker-compose.dev.yml"

# Check if Docker Compose is running and stop/remove if it is
if [ "$(docker-compose -p "$docker_compose_project" -f "$docker_compose_file" ps -q)" ]; then
  echo -e "\nStopping and removing existing Docker Compose services..."
  docker-compose -p "$docker_compose_project" -f "$docker_compose_file" down 
fi

# Start Docker Compose
echo -e "\nStarting Docker Compose..."
docker-compose -p "$docker_compose_project" -f "$docker_compose_file" up -d 

# Check if the --seed-fake-data flag or other flags are passed
extra_args="$@"

# Run the seeding script with optional arguments
echo -e "\nSeeding the database..."
pnpm tsx scripts/bootstrap.ts $extra_args

echo -e "\nDevelopment infrastructure setup completed."
