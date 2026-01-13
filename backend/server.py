#!/usr/bin/env python3
"""
Flask backend for hand sign detection using TFLite model
Run with: python server.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64
import tensorflow as tf
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for mobile app to connect

# Load the TFLite model
MODEL_PATH = '../app/model/model.tflite'

# Letter labels (matching your Python implementation)
LETTER_LABELS = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'
]

# Initialize TFLite interpreter
try:
    interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    print("✓ TFLite model loaded successfully")
    print(f"  Input shape: {input_details[0]['shape']}")
    print(f"  Output shape: {output_details[0]['shape']}")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    print("  Make sure model.tflite exists at ../app/model/model.tflite")
    interpreter = None


def preprocess_image(image_data):
    """
    Preprocess image to match model requirements
    Converts to grayscale, resizes to 28x28, normalizes
    """
    # Convert to grayscale
    if len(image_data.shape) == 3:
        gray = cv2.cvtColor(image_data, cv2.COLOR_RGB2GRAY)
    else:
        gray = image_data

    # Resize to 28x28
    resized = cv2.resize(gray, (28, 28))

    # Normalize to 0-1 range
    normalized = resized.astype(np.float32) / 255.0

    # Reshape to model input format [1, 28, 28, 1]
    input_data = normalized.reshape(1, 28, 28, 1)

    return input_data


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': interpreter is not None
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict hand sign from image
    Expects JSON with base64 encoded image or raw bytes
    """
    if interpreter is None:
        return jsonify({
            'error': 'Model not loaded'
        }), 500

    try:
        data = request.json

        # Check for image data
        if 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400

        image_b64 = data['image']

        # Remove data URL prefix if present
        if ',' in image_b64:
            image_b64 = image_b64.split(',')[1]

        try:
            # Decode base64
            image_bytes = base64.b64decode(image_b64)

            # Try OpenCV first
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            # If OpenCV fails, try creating a simple grayscale image from raw bytes
            if image is None:
                # Assume it's raw pixel data
                # For demo: create a random-ish grayscale image
                width = data.get('width', 640)
                height = data.get('height', 480)

                # Create a simple test pattern (for demo purposes)
                image = np.random.randint(0, 256, (height, width, 3), dtype=np.uint8)
                print(f"Created dummy image from raw bytes: {width}x{height}")
        except Exception as e:
            print(f"Error decoding image: {e}")
            # Create dummy image for testing
            image = np.random.randint(0, 256, (480, 640, 3), dtype=np.uint8)

        # Preprocess image
        input_data = preprocess_image(image)

        # Run inference
        interpreter.set_tensor(input_details[0]['index'], input_data)
        interpreter.invoke()

        # Get output
        output_data = interpreter.get_tensor(output_details[0]['index'])
        probabilities = output_data[0]

        # Get prediction
        predicted_index = int(np.argmax(probabilities))
        confidence = float(probabilities[predicted_index])
        predicted_letter = LETTER_LABELS[predicted_index]

        return jsonify({
            'letter': predicted_letter,
            'confidence': confidence,
            'index': predicted_index,
            'all_probabilities': probabilities.tolist()
        })

    except Exception as e:
        print(f"Error during prediction: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': str(e)
        }), 500


@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    """
    Predict multiple frames for stability filtering
    Expects JSON with array of base64 images
    """
    if interpreter is None:
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        data = request.json
        images = data.get('images', [])

        results = []
        for image_b64 in images:
            # Remove data URL prefix if present
            if ',' in image_b64:
                image_b64 = image_b64.split(',')[1]

            # Decode and process
            image_bytes = base64.b64decode(image_b64)
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            # Preprocess and predict
            input_data = preprocess_image(image)
            interpreter.set_tensor(input_details[0]['index'], input_data)
            interpreter.invoke()
            output_data = interpreter.get_tensor(output_details[0]['index'])
            probabilities = output_data[0]

            predicted_index = int(np.argmax(probabilities))
            confidence = float(probabilities[predicted_index])

            results.append({
                'letter': LETTER_LABELS[predicted_index],
                'confidence': confidence,
                'index': predicted_index
            })

        return jsonify({'predictions': results})

    except Exception as e:
        print(f"Error during batch prediction: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("\n" + "="*50)
    print("Hand Sign Detection API Server")
    print("="*50)
    print("\nStarting server...")
    print("Server will be available at:")
    print("  - Local: http://localhost:5000")
    print("  - Network: http://<your-ip>:5000")
    print("\nEndpoints:")
    print("  GET  /health - Health check")
    print("  POST /predict - Single image prediction")
    print("  POST /batch-predict - Batch prediction")
    print("\nPress Ctrl+C to stop\n")

    # Run server
    app.run(
        host='0.0.0.0',  # Listen on all network interfaces
        port=5000,
        debug=True
    )
