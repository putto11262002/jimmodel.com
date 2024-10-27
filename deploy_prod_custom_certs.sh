#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    source .env
else
    echo "Error: .env file not found!"
    exit 1
fi

# Set project name
PROJECT="jimmodel_prod"
DOCKER_COMPOSE_FILE="./docker/prod/custom-certs/docker-compose.yml"
PROJECT_DIRECTORY=$(pwd)



# Function to create a directory as a privileged user if it doesn't exist, ensuring Docker accessibility
create_directory() {
    local dir=$1
    if [ ! -d "$dir" ]; then
        echo "Creating directory: $dir"
        sudo mkdir -p "$dir"
        sudo chmod 777 "$dir"  # Grant full permissions for Docker access
    else
        echo "Directory already exists: $dir"
    fi
}

# Function to check if services are running
check_running_services() {
    if [ "$(docker ps -q)" ]; then
        read -p "There are running containers. Do you want to remove them? (yes/no): " answer
        if [[ "$answer" =~ ^[Yy][Ee][Ss]$ ]]; then
            echo "Stopping and removing all running containers..."
            docker compose -p "$PROJECT" -f "$DOCKER_COMPOSE_FILE" --project-directory "$PROJECT_DIRECTORY" down -v 
        else
            echo "Exiting as requested..."
            exit 0
        fi
    else
        echo "No running containers found. Proceeding with deployment..."
    fi
}

# Main deployment process
main() {
    # Check and handle running services
    check_running_services

    create_directory "$MINIO_DATA"
    create_directory "$REDIS_DATA"
    create_directory "$POSTGRES_DATA"

    # Start postgres, minio, and reverse-proxy services in detached mode and wait for them to be ready
    echo "Starting reverse-proxy, postgres, minio, and redis services..."
    docker compose -p "$PROJECT" -f "$DOCKER_COMPOSE_FILE" --project-directory "$PROJECT_DIRECTORY" up -d --wait postgres minio redis || {
        echo "Error: Failed to start services"
        exit 1
    }

    # Run minio-mc service with complete rebuild
    echo "Initializing minio..."
    docker compose -p "$PROJECT" -f "$DOCKER_COMPOSE_FILE" --project-directory "$PROJECT_DIRECTORY" run --rm minio-mc

    echo "Bootstrapping the app..."
    docker compose -p "$PROJECT" -f "$DOCKER_COMPOSE_FILE" --project-directory "$PROJECT_DIRECTORY" run --build --rm bootstrap_runner

    echo "Building and running app..."
    docker compose -p "$PROJECT" -f "$DOCKER_COMPOSE_FILE" --project-directory "$PROJECT_DIRECTORY" up --build -d app


    echo "Starting nginx"
    docker compose -p "$PROJECT" -f "$DOCKER_COMPOSE_FILE" --project-directory "$PROJECT_DIRECTORY" up -d --wait nginx || {
        echo "Error: Failed to start nginx"
        exit 1
    }
}

# Execute main function
main

