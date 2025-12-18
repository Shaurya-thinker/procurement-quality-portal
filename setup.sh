#!/bin/bash

echo "Installing Procurement Quality Portal dependencies..."
echo ""

# Install Backend dependencies
echo "Installing Backend Python dependencies..."
cd backend
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install Frontend dependencies
echo "Installing Frontend Node dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "✓ All dependencies installed successfully!"
echo "You can now run the application."
