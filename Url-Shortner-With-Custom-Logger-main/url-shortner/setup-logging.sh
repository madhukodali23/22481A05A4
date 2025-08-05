#!/bin/bash

# Script to install the logging-middleware as a local dependency

echo "Installing logging-middleware as a local dependency..."

# Navigate to the project root directory
cd "$(dirname "$0")"

# Install logging-middleware dependencies first
cd ../logging-middleware
npm install
echo "Logging middleware dependencies installed."

# Return to the frontend project and install it as a local dependency
cd ../url-shortner
npm install ../logging-middleware
echo "Logging middleware installed as a local dependency."

# Install any other dependencies the frontend project needs
npm install
echo "Frontend dependencies installed."

echo "Setup complete. You can now run the project with 'npm run dev'."
