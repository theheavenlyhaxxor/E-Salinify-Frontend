# Hand Sign Detection Backend

This Flask server provides an API for real-time hand sign detection using your TFLite model.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Server

```bash
python server.py
```

The server will start on `http://0.0.0.0:5000`

### 3. Find Your IP Address

**On Linux/Mac:**
```bash
hostname -I | awk '{print $1}'
```

**On Windows:**
```cmd
ipconfig
```

Look for your local IP (usually starts with 192.168.x.x or 10.0.x.x)

### 4. Update the App

Edit `services/TFLiteService.ts` and replace `YOUR_IP_HERE` with your actual IP address.

## API Endpoints

### Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### Single Prediction
```bash
POST /predict
Content-Type: application/json

{
  "image": "base64_encoded_image"
}
```

Response:
```json
{
  "letter": "A",
  "confidence": 0.95,
  "index": 0
}
```

### Batch Prediction
```bash
POST /batch-predict
Content-Type: application/json

{
  "images": ["base64_image1", "base64_image2"]
}
```

## Testing

Test the server:

```bash
curl http://localhost:5000/health
```

## Troubleshooting

### Model not found
Make sure `model.tflite` exists at `../app/model/model.tflite`

### Port already in use
Change the port in `server.py`:
```python
app.run(host='0.0.0.0', port=5001)
```

### Can't connect from phone
1. Make sure phone and computer are on the same WiFi
2. Check firewall settings
3. Verify the IP address is correct
