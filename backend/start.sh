#!/bin/bash

echo "=================================="
echo "Hand Sign Detection Backend Setup"
echo "=================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✓ Python 3 found: $(python3 --version)"
echo ""

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip3 first."
    exit 1
fi

echo "✓ pip3 found"
echo ""

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📦 Installing dependencies..."
    pip3 install -r requirements.txt

    if [ $? -eq 0 ]; then
        echo "✓ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "⚠️  requirements.txt not found"
fi

echo ""
echo "=================================="
echo "Finding your IP address..."
echo "=================================="
echo ""

# Get IP address (works on Linux/Mac)
if command -v hostname &> /dev/null; then
    IP=$(hostname -I 2>/dev/null | awk '{print $1}')
    if [ -n "$IP" ]; then
        echo "📍 Your IP address: $IP"
        echo ""
        echo "⚠️  IMPORTANT: Update this IP in services/TFLiteService.ts"
        echo "   Change: const API_URL = 'http://$IP:5000';"
    fi
fi

echo ""
echo "=================================="
echo "Starting Backend Server..."
echo "=================================="
echo ""

# Start the server
python3 server.py
