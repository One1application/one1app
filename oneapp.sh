#!/bin/bash

# Check for required files based on environment
check_env_files() {
  local env=$1
  if [ "$env" == "development" ]; then
    if [ ! -f .env.development ]; then
      echo "Error: .env.development file not found! Please create this file."
      exit 1
    fi
    if [ ! -f docker-compose.dev.yml ]; then
      echo "Error: docker-compose.dev.yml file not found! Please create this file."
      exit 1
    fi
  elif [ "$env" == "production" ]; then
    if [ ! -f .env.production ]; then
      echo "Error: .env.production file not found! Please create this file."
      exit 1
    fi
    if [ ! -f docker-compose.prod.yml ]; then
      echo "Error: docker-compose.prod.yml file not found! Please create this file."
      exit 1
    fi
  else
    echo "Error: Unknown environment '$env'. Please select 'development' or 'production'."
    exit 1
  fi
}

# Set resource names
ONE_APP_IMAGE_PREFIX="one1app"
POSTGRES_VOLUME="postgres-data"
NETWORK_NAME="queue-net"

# Function to clean up containers, images, volumes, and network
cleanup() {
  local env=$1
  echo "Starting cleanup process for ONE_APP ($env environment)..."

  # Stop all running ONE_APP containers
  echo "Stopping all ONE_APP containers..."
  docker stop mongo_container client server admin > /dev/null 2>&1

  # Remove all ONE_APP containers
  echo "Removing all ONE_APP containers..."
  docker rm mongo_container client server admin > /dev/null 2>&1

  # Remove all ONE_APP images
  echo "Removing all ONE_APP Docker images..."
  docker rmi $(docker images -q --filter "reference=mongo*") > /dev/null 2>&1
  docker rmi $(docker images -q --filter "reference=client*") > /dev/null 2>&1
  docker rmi $(docker images -q --filter "reference=server*") > /dev/null 2>&1
  docker rmi $(docker images -q --filter "reference=admin*") > /dev/null 2>&1

  # Remove the MongoDB volume
  echo "Removing the Postgres Docker volume..."
  docker volume rm $POSTGRES_VOLUME > /dev/null 2>&1

  # Optionally remove the ONE_APP network
  echo "Removing the ONE_APP Docker network..."
  docker network rm $NETWORK_NAME > /dev/null 2>&1

  echo "Cleanup complete. All ONE_APP containers, images, and volumes have been removed."
}

# Function to start services
start_services() {
  local env=$1
  local services=$2
  
  if [ "$env" == "development" ]; then
    docker compose --env-file .env.development -f docker-compose.dev.yml up $services
  elif [ "$env" == "production" ]; then
    docker-compose --env-file .env.production -f docker-compose.prod.yml up -d $services
  fi
}

# Function to display the interactive menu
show_menu() {
  echo "Please select the environment:"
  echo "1) Development"
  echo "2) Production"
  echo "3) Exit"
  read -p "Enter your choice [1-3]: " env_choice

  case $env_choice in
    1)
      ENV="development"
      ;;
    2)
      ENV="production"
      ;;
    3)
      echo "Exiting..."
      exit 0
      ;;
    *)
      echo "Invalid choice. Please select a valid option (1-3)."
      return 1
      ;;
  esac

  check_env_files $ENV

  echo "Please select the service you want to run:"
  echo "1) All (This will remove all containers and images and start everything from scratch. NOTE: It will take time)"
  echo "2) Server (Only start the server)"
  echo "3) Client (Only start the client)"
  echo "4) Server & Client (Start both server and client)"
  echo "5) Admin (Only start the admin panel)"
  echo "6) Server & Admin (Start server and admin panel)"
  echo "7) Back to environment selection"
  echo "8) Exit"
  read -p "Enter your choice [1-8]: " service_choice

  return 0
}

# Main script logic
if [ $# -eq 0 ]; then
  # Show the interactive menu if no argument is passed
  while true; do
    show_menu
    if [ $? -eq 1 ]; then
      continue
    fi

    case $service_choice in
      1)
        echo "You chose: All. Cleaning up and starting everything..."
        cleanup $ENV
        if [ "$ENV" == "development" ]; then
          start_services $ENV "--build --force-recreate"
        else
          start_services $ENV "--build --force-recreate"
          echo "Production services have been started in detached mode"
        fi
        break
        ;;
      2)
        echo "You chose: Server. Starting only the server..."
        start_services $ENV "server"
        break
        ;;
      3)
        echo "You chose: Client. Starting only the client..."
        start_services $ENV "client"
        break
        ;;
      4)
        echo "You chose: Server & Client. Starting both server and client..."
        start_services $ENV "server client"
        break
        ;;
      5)
        echo "You chose: Admin. Starting only the admin panel..."
        start_services $ENV "admin"
        break
        ;;
      6)
        echo "You chose: Server & Admin. Starting server and admin panel..."
        start_services $ENV "server admin"
        break
        ;;
      7)
        continue
        ;;
      8)
        echo "Exiting..."
        exit 0
        ;;
      *)
        echo "Invalid choice. Please select a valid option (1-8)."
        ;;
    esac
  done
else
  echo "Usage: ./run.sh (Run the script without arguments for interactive mode)"
  exit 1
fi