#!/bin/bash

echo ""
echo "🔍 Finding your IP address..."
echo ""

# Try different methods to get IP
IP=""

# Method 1: hostname -I (Linux)
if command -v hostname &> /dev/null; then
    IP=$(hostname -I 2>/dev/null | awk '{print $1}')
fi

# Method 2: ip addr (Linux alternative)
if [ -z "$IP" ] && command -v ip &> /dev/null; then
    IP=$(ip addr show | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}' | cut -d/ -f1 | head -n1)
fi

# Method 3: ifconfig (Mac/BSD)
if [ -z "$IP" ] && command -v ifconfig &> /dev/null; then
    IP=$(ifconfig | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}' | head -n1)
fi

if [ -n "$IP" ]; then
    echo "✅ Your IP address: $IP"
    echo ""
    echo "📝 Update this in services/TFLiteService.ts:"
    echo ""
    echo "   const API_URL = 'http://$IP:5000';"
    echo ""
else
    echo "❌ Could not automatically detect IP address"
    echo ""
    echo "Please find it manually:"
    echo "  - Linux/Mac: Run 'hostname -I' or 'ifconfig'"
    echo "  - Windows: Run 'ipconfig' and look for IPv4 Address"
    echo ""
fi
