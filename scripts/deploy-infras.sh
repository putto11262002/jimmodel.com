#!/bin/bash

# Define the project name (replace 'your_project_name' with the actual project name)
PROJECT_NAME="jimmodel"

# Start Docker Compose services
echo "Starting Docker Compose services for project: $PROJECT_NAME"
docker compose -p "$PROJECT_NAME" up -d --build --pull always postgres minio reverse-proxy

echo "Docker Compose services for project: $PROJECT_NAME have been updated and started."

