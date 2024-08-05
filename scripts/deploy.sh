#!/bin/bash

# Define the project name (replace 'your_project_name' with the actual project name)
PROJECT_NAME="jimmodel"

# Parse command-line arguments
VOLUME_OPTION=""

while getopts "v" opt; do
  case $opt in
    v)
      VOLUME_OPTION="-v"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

echo "Stopping and removing Docker Compose services for project: $PROJECT_NAME"
docker-compose -p $PROJECT_NAME down $VOLUME_OPTION || echo "No running Docker Compose services found for project: $PROJECT_NAME. Continuing..."

echo "Pulling updated versions of the containers for project: $PROJECT_NAME"
docker-compose -p $PROJECT_NAME pull

echo "Starting Docker Compose services for project: $PROJECT_NAME"
docker-compose -p $PROJECT_NAME up --build -d --wait

echo "Docker Compose services for project: $PROJECT_NAME have been updated and started."
