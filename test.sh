#!/bin/bash

# Function to build the Docker image locally
build_local() {
    echo "You chose to build the Docker image locally."
    # Add your command for building a local Docker image here
    # Example: docker build -t your-image-name .
    echo "Building Docker image locally..."
}

# Function to build the Docker image for Digital Ocean
build_digital_ocean() {
    echo "You chose to build the Docker image for Digital Ocean."
    
    # Check if doctl (Digital Ocean CLI) is installed
    if ! command -v doctl &> /dev/null; then
        echo "doctl is not installed."
        read -p "Do you want to install doctl now? (y/n): " install_choice

        if [[ $install_choice =~ ^[Yy]$ ]]; then
            # Check the OS and install doctl accordingly
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                echo "Installing doctl using Homebrew..."
                brew install doctl
            elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
                # Ubuntu
                echo "Installing doctl using apt..."
                
                # Update package list and install doctl
                sudo apt update
                sudo apt install -y doctl

                # Verify installation
                if command -v doctl &> /dev/null; then
                    echo "doctl installed successfully."
                else
                    echo "Failed to install doctl. Exiting."
                    exit 1
                fi
            else
                echo "Unsupported OS. Please install doctl manually."
                exit 1
            fi
        else
            echo "Exiting. Please install doctl before proceeding."
            exit 1
        fi
    fi
    
    # Prompt for Digital Ocean access token
    read -p "Enter your Digital Ocean access token: " DO_ACCESS_TOKEN

    # Check if the Digital Ocean access token is empty
    if [ -z "$DO_ACCESS_TOKEN" ]; then
        echo "Error: Digital Ocean access token cannot be empty. Exiting."
        exit 1
    fi

    # Check if POSTGRES_PUBLIC_HOSTNAME is set
    if [ -z "$POSTGRES_PUBLIC_HOSTNAME" ]; then
        echo "Error: POSTGRES_PUBLIC_HOSTNAME is not set. Check your .env file."
        exit 1
    fi

    # Add your command for building the Docker image for Digital Ocean here
    echo "Building Docker image for Digital Ocean with POSTGRES_PUBLIC_HOSTNAME=$POSTGRES_PUBLIC_HOSTNAME"
    # Example: docker build -t your-image-name .
}

# Source the .env file if it exists
[ -f .env ] && source .env

PS3="-> Select an option: "

echo "Select the environment to build the Docker image:"
options=("local" "digital ocean")

select opt in "${options[@]}"
do
    case $opt in
        "local")
            build_local
            break
            ;;
        "digital ocean")
            build_digital_ocean
            break
            ;;
        *)
            echo "Invalid option $REPLY. Exiting."
            exit 1
            ;;
    esac
done
