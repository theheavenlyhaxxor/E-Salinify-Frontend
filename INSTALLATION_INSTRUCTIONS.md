# Hand Sign Translation Feature - Installation Instructions

## Overview
This implementation converts your Python hand sign recognition code to work in your React Native mobile app using TensorFlow.js, allowing real-time hand sign translation through your phone's camera.

## Prerequisites
- Node.js and npm (or yarn/pnpm) installed
- Expo CLI installed
- Your TFLite model file at `./app/model/model.tflite`

## Installation Steps

### 1. Install Required Dependencies

Run the following command in your terminal:

```bash
npm install expo-camera @tensorflow/tfjs @tensorflow/tfjs-react-native @react-native-community/async-storage expo-gl expo-gl-cpp
```

Or if using yarn:

```bash
yarn add expo-camera @tensorflow/tfjs @tensorflow/tfjs-react-native @react-native-community/async-storage expo-gl expo-gl-cpp
```

### 2. Convert Your TFLite Model

Your model at `./app/model/model.tflite` needs to be converted to TensorFlow.js format. You have two options:

#### Option A: Use TensorFlow.js Converter (Recommended)

Install the converter:
```bash
pip install tensorflowjs
```

Convert your model:
```bash
tensorflowjs_converter \
    --input_format=tf_saved_model \
    --output_format=tfjs_graph_model \
    --signature_name=serving_default \
    --saved_model_tags=serve \
    ./path/to/your/saved_model \
    ./app/model/
```

This will create `model.json` and weight files in the `./app/model/` directory.

#### Option B: Load TFLite Directly

Alternatively, update the ModelService.ts to load TFLite models directly:

```typescript
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

// Load TFLite model directly
const model = await tf.loadLayersModel(
  bundleResourceIO(require('../app/model/model.tflite'))
);
```

### 3. Update app.json for Camera Permissions

Add camera permissions to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow E-Salinify to access your camera for hand sign translation."
        }
      ]
    ]
  }
}
```

### 4. Prebuild the App (If Using Expo Dev Client)

If you're using Expo Dev Client or bare workflow:

```bash
npx expo prebuild
```

### 5. Run the App

For development:

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android

# Or use Expo Go (limited TensorFlow support)
npx expo start
```

## Features Implemented

### ✅ Real-time Camera Processing
- Camera feed with TensorFlow.js integration
- Frame-by-frame hand sign detection
- Optimized for mobile performance

### ✅ Stability Filtering
- Uses 10-frame buffer (configurable via `STABILITY_FRAMES`)
- Only adds letters when confidence > 85% (configurable via `CONFIDENCE_THRESHOLD`)
- Prevents duplicate letter additions

### ✅ User Interface
- Live camera preview
- Real-time detection display with confidence percentage
- Translated text display area
- Control buttons (Space, Delete, Clear)
- Permission handling
- Loading states

### ✅ Model Integration
- TensorFlow.js model loading
- Image preprocessing (grayscale, resize to 28x28, normalization)
- A-Z letter recognition (24 letters: A-Y, excluding J and Z)

## Files Created/Modified

1. **Services**
   - `services/ModelService.ts` - TensorFlow model loader and prediction service

2. **Hooks**
   - `hooks/useHandSignDetection.ts` - Hand sign detection logic with stability filtering

3. **Screens**
   - `app/home/camera/index.tsx` - Updated camera screen with live detection

4. **Styles**
   - `assets/styles/CameraScreen.style.tsx` - Updated with comprehensive camera UI styles

## Configuration

### Adjust Detection Parameters

Edit `services/ModelService.ts`:

```typescript
export const CONFIDENCE_THRESHOLD = 0.85; // Minimum confidence (0-1)
export const STABILITY_FRAMES = 10;        // Frames to confirm letter
```

### Modify Letters

If your model has different letter mappings, update the `LETTER_LABELS` array in `services/ModelService.ts`:

```typescript
export const LETTER_LABELS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'
];
```

## Troubleshooting

### Camera Not Working
- Ensure camera permissions are granted
- Check that `expo-camera` is properly installed
- Verify permissions in `app.json`

### Model Not Loading
- Confirm model files exist at `./app/model/`
- Check that TensorFlow.js is properly initialized
- Verify model format (should be tfjs_graph_model or compatible)

### Low Performance
- Reduce camera resolution in TensorCamera component
- Increase frame skip rate
- Optimize model (quantization, pruning)

### Incorrect Predictions
- Adjust `CONFIDENCE_THRESHOLD` (try 0.7-0.9)
- Modify `STABILITY_FRAMES` (try 5-15)
- Ensure good lighting conditions
- Check hand positioning in camera frame

## Usage

1. Open the app and navigate to the Camera screen
2. Grant camera permissions when prompted
3. Wait for TensorFlow and model to initialize
4. Position your hand in front of the camera
5. Perform hand signs - letters will appear when detected with high confidence
6. Use control buttons:
   - **Space**: Add a space to the text
   - **Delete**: Remove last character
   - **Clear**: Clear all translated text

## Performance Notes

- First run may take longer to initialize TensorFlow.js
- Subsequent launches will be faster
- Real-time processing depends on device capabilities
- Lower-end devices may need reduced camera resolution

## Next Steps

- Test with your specific model
- Fine-tune confidence threshold and stability frames
- Add word prediction/autocorrect
- Implement text-to-speech for translated text
- Add ability to save/share translated text
- Consider adding support for J and Z hand signs if your model includes them
