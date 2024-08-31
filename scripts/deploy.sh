#!/bin/bash

# Define the project name (replace 'your_project_name' with the actual project name)
PROJECT_NAME="jimmodel"

docker compose -p "$PROJECT_NAME" up -d --build --wait --pull always app
