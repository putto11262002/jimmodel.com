#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    source .env
else
    echo "Error: .env file not found!"
    exit 1
fi

# Set project name
PROJECT="jimmodel_stage"

# Function to create a directory if it doesn't exist, ensuring Docker accessibility
create_directory() {
    local dir=$1
    if [ ! -d "$dir" ]; then
        echo "Creating directory: $dir"
        mkdir -p "$dir"
        chmod 777 "$dir"  # Grant permissions for Docker access
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
            docker compose -p $PROJECT down -v --rmi local
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

    # Create necessary directories
    create_directory "$MINIO_DATA"
    create_directory "$LETSENCRYPT_DATA"
    create_directory "$REDIS_DATA"
    create_directory "$POSTGRES_DATA"

    # Start postgres, minio, and reverse-proxy services in detached mode and wait for them to be ready
    echo "Starting reverse-proxy, postgres, minio, and redis services..."
    docker compose -p $PROJECT up -d --wait postgres minio reverse-proxy redis || {
        echo "Error: Failed to start services"
        exit 1
    }
    
    # Run minio-mc service with complete rebuild
    echo "Initializing minio..."
    docker compose -p $PROJECT run --rm minio-mc

    echo "Bootstrapping the app..."
    docker compose -p $PROJECT run --build --rm bootstrap_runner

    echo "Building and running app..."
    docker compose -p $PROJECT up --build -d app
}

# Execute main function
main
