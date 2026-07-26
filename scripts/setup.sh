#!/bin/bash

echo "Cipher Protocol - Setup"
echo "=================================="

echo "Checking prerequisites..."
python3 --version
node --version

echo "Creating project structure..."
mkdir -p backend/{api,config}
mkdir -p agents
mkdir -p ml/models
mkdir -p integrations
mkdir -p data
mkdir -p tests
mkdir -p scripts
mkdir -p docs

echo "Setting up Python environment..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cd ..

echo "Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Please edit .env with your API keys"
fi

echo "Setup complete!"
echo "Run: cd backend && python3 main.py"
