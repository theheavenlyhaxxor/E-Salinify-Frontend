# Quick Start Guide - Hand Sign Translation

## Dependency Installation Issue & Solution

You're encountering a dependency conflict. Here are your options:

### Option 1: Install with Legacy Peer Deps (Recommended)

```bash
npm install expo-camera @tensorflow/tfjs @tensorflow/tfjs-react-native expo-gl expo-gl-cpp --legacy-peer-deps
```

This will install the packages despite the peer dependency mismatch. The newer async-storage version should still work fine.

### Option 2: Downgrade async-storage (Not Recommended)

```bash
npm install @react-native-async-storage/async-storage@1.23.1 --legacy-peer-deps
```

Then install the TensorFlow packages:
```bash
npm install expo-camera @tensorflow/tfjs @tensorflow/tfjs-react-native expo-gl expo-gl-cpp --legacy-peer-deps
```

### Option 3: Use Alternative TensorFlow Setup (Recommended Alternative)

Instead of the outdated `@tensorflow/tfjs-react-native`, use a more modern approach with MediaPipe or React Native Vision Camera + TensorFlow Lite.

Would you like me to implement this alternative? It's more modern and doesn't have dependency conflicts.

## After Installing Dependencies

### 1. Update package.json

Add this to your `package.json` to handle the peer dependency issue:

```json
{
  "overrides": {
    "@tensorflow/tfjs-react-native": {
      "@react-native-async-storage/async-storage": "$@react-native-async-storage/async-storage"
    }
  }
}
```

### 2. Update app.json

Add camera permissions:

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

### 3. Prepare Your Model

You need to convert your TFLite model. If you have the original `smnist.h5` Keras model:

```bash
pip install tensorflowjs
tensorflowjs_converter --input_format keras ./smnist.h5 ./app/model/tfjs
```

### 4. Rebuild the App

```bash
npx expo prebuild --clean
npx expo run:android  # or run:ios
```

## Alternative: Modern Implementation (No Dependency Conflicts)

I can provide an updated implementation using:
- `react-native-vision-camera` (more modern, actively maintained)
- `vision-camera-plugin-tensorflow-lite` (direct TFLite support)

This avoids the outdated TensorFlow.js React Native package entirely.

Would you like me to implement this alternative approach?
