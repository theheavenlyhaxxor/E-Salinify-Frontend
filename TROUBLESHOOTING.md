# Network Request Failed - Troubleshooting Guide

## Error: "Network request failed"

This means your phone can't reach the backend server. Here's how to fix it:

---

## ✅ Quick Checklist

### 1. Backend Server Running?

Check your terminal where you ran `python3 server.py`. You should see:
```
Hand Sign Detection API Server
...
* Running on http://0.0.0.0:5000
```

If not, start it:
```bash
cd backend
python3 server.py
```

---

### 2. Same WiFi Network?

**CRITICAL:** Your phone and computer MUST be on the same WiFi network.

- Phone WiFi: Check settings → WiFi → Connected network
- Computer WiFi: Should be the same network name

**Common mistakes:**
- Phone on mobile data ❌
- Phone on guest WiFi, computer on main WiFi ❌
- Phone on 5GHz, computer on 2.4GHz (same network name is OK) ✅

---

### 3. Correct IP Address?

#### Find Your Computer's IP:

**Linux/Mac:**
```bash
hostname -I | awk '{print $1}'
```

**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" (usually starts with 192.168.x.x or 10.0.x.x)

#### Update the App:

Open `services/TFLiteService.ts` and update line 5:
```typescript
const API_URL = "http://YOUR_IP_HERE:5000";
```

**Example:**
```typescript
const API_URL = "http://192.168.1.30:5000";  // ✅ Your actual IP
```

**Common mistakes:**
- Using `localhost` ❌ (only works on computer, not phone)
- Using `127.0.0.1` ❌ (only works on computer, not phone)
- Using old IP address ❌ (IP can change when you reconnect to WiFi)

---

### 4. Firewall Blocking Port 5000?

**Linux:**
```bash
sudo ufw status
sudo ufw allow 5000
```

**Mac:**
System Preferences → Security & Privacy → Firewall → Firewall Options → Allow Python

**Windows:**
Windows Defender Firewall → Allow an app → Allow Python on Private networks

---

### 5. Test Connection from Phone

#### Option A: Use Phone Browser
Open browser on phone and visit:
```
http://YOUR_IP:5000/health
```

**Should see:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

#### Option B: Use curl (if you have Termux on Android)
```bash
curl http://YOUR_IP:5000/health
```

---

## 🔍 Advanced Debugging

### Check if Backend is Listening on All Interfaces

In `backend/server.py`, verify this line at the bottom:
```python
app.run(host='0.0.0.0', port=5000, debug=True)
```

- `host='0.0.0.0'` ✅ Listens on all network interfaces
- `host='localhost'` ❌ Only listens locally

### Check Network Connectivity

**From computer, ping your phone:**
```bash
# First, find your phone's IP (in phone's WiFi settings)
ping YOUR_PHONE_IP
```

**From phone, ping your computer:**
Use a network utility app to ping `YOUR_COMPUTER_IP`

---

## 🛠️ Common Solutions

### Solution 1: Restart Everything
1. Stop backend server (Ctrl+C)
2. Close Expo app on phone
3. Restart backend: `python3 server.py`
4. Restart app: `npx expo start` then reload on phone

### Solution 2: Use USB Debugging (Android)
If WiFi isn't working, use ADB port forwarding:
```bash
adb reverse tcp:5000 tcp:5000
```
Then use `http://localhost:5000` in TFLiteService.ts

### Solution 3: Disable VPN
If you're using a VPN on phone or computer, disable it temporarily.

### Solution 4: Check Router Settings
Some routers have "AP Isolation" that prevents devices from talking to each other:
- Router settings → Wireless → Disable "AP Isolation"
- Router settings → Guest Network → Make sure not using guest WiFi

---

## 📱 Platform-Specific Issues

### iOS Specific

iOS requires HTTPS for network requests (App Transport Security). Two options:

**Option 1: Add exception in app.json:**
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSAppTransportSecurity": {
          "NSAllowsArbitraryLoads": true
        }
      }
    }
  }
}
```

**Option 2: Use ngrok for HTTPS:**
```bash
ngrok http 5000
```
Then update API_URL to the ngrok URL.

### Android Specific

**If using real device via USB:**
```bash
adb reverse tcp:5000 tcp:5000
```
Then use `http://localhost:5000` in API_URL

**If using Android emulator:**
Use `http://10.0.2.2:5000` instead of your IP

---

## ✅ Step-by-Step Verification

### Step 1: Verify Backend
```bash
cd backend
python3 server.py
```
Should see: "Running on http://0.0.0.0:5000"

### Step 2: Test from Computer
Open browser: `http://localhost:5000/health`
Should see: `{"status": "healthy", "model_loaded": true}`

### Step 3: Get Computer IP
```bash
hostname -I | awk '{print $1}'
```
Example output: `192.168.1.30`

### Step 4: Test from Phone Browser
Open phone browser: `http://192.168.1.30:5000/health`
Should see: `{"status": "healthy", "model_loaded": true}`

### Step 5: Update App
Edit `services/TFLiteService.ts`:
```typescript
const API_URL = "http://192.168.1.30:5000";
```

### Step 6: Reload App
In Expo: Press `r` to reload
Or: Shake phone → Reload

---

## 🎯 Expected Results

### When Working:
- Banner shows: **"✅ Connected to AI Backend - Real Detection Active!"** (Green)
- Console log: `"✓ Backend connected and model loaded"`
- Backend terminal shows: `192.168.1.X - - [timestamp] "POST /predict HTTP/1.1" 200 -`

### When Not Working:
- Banner shows: **"📌 Demo Mode - Start backend for real detection"** (Yellow)
- Console log: `"⚠ Backend not available, using demo mode"`
- Error: `"Network request failed"`

---

## 💡 Quick Test Script

Create `test-connection.sh`:
```bash
#!/bin/bash

echo "Testing backend connection..."
echo ""

# Get IP
IP=$(hostname -I | awk '{print $1}')
echo "Your IP: $IP"
echo "Update TFLiteService.ts with: const API_URL = \"http://$IP:5000\";"
echo ""

# Test health endpoint
echo "Testing health endpoint..."
curl http://localhost:5000/health
echo ""

echo ""
echo "Now test from phone browser: http://$IP:5000/health"
```

Run: `chmod +x test-connection.sh && ./test-connection.sh`

---

## 📞 Still Not Working?

If you've tried everything above and it still doesn't work:

1. **Check the exact error** in React Native debugger
2. **Check backend logs** for any errors
3. **Try using ngrok** as a workaround
4. **Use demo mode** for now (works without backend)

The demo mode still shows the full UI and functionality, just with random predictions instead of real ones.
