#!/usr/bin/env python3
"""
Convert TFLite model to TensorFlow.js format
Usage: python convert-model.py
"""

import os
import subprocess
import sys

def check_tensorflowjs_installed():
    """Check if tensorflowjs is installed"""
    try:
        import tensorflowjs
        print("✓ tensorflowjs is installed")
        return True
    except ImportError:
        print("✗ tensorflowjs is not installed")
        return False

def install_tensorflowjs():
    """Install tensorflowjs"""
    print("Installing tensorflowjs...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "tensorflowjs"])
        print("✓ tensorflowjs installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("✗ Failed to install tensorflowjs")
        return False

def convert_tflite_to_tfjs():
    """Convert TFLite model to TensorFlow.js format"""

    # Check if model file exists
    model_path = "./app/model/model.tflite"
    if not os.path.exists(model_path):
        print(f"✗ Model file not found at {model_path}")
        return False

    print(f"✓ Found model at {model_path}")

    # Create output directory
    output_dir = "./app/model/tfjs"
    os.makedirs(output_dir, exist_ok=True)

    print(f"Converting model to TensorFlow.js format...")
    print(f"Output directory: {output_dir}")

    try:
        # For TFLite models, we need to use the converter differently
        # This is a simplified version - you may need to adjust based on your model

        import tensorflow as tf
        import tensorflowjs as tfjs

        # Load the TFLite model
        interpreter = tf.lite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()

        # Get input and output details
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        print("\nModel Information:")
        print(f"  Input shape: {input_details[0]['shape']}")
        print(f"  Input type: {input_details[0]['dtype']}")
        print(f"  Output shape: {output_details[0]['shape']}")
        print(f"  Output type: {output_details[0]['dtype']}")

        print("\n⚠ Note: Direct TFLite to TFJS conversion requires the original SavedModel or Keras model")
        print("If you have the original .h5 model file, use the following command instead:")
        print(f"\n  tensorflowjs_converter --input_format keras ./path/to/smnist.h5 {output_dir}\n")

        return False

    except Exception as e:
        print(f"✗ Error during conversion: {e}")
        print("\nAlternative approaches:")
        print("1. If you have the original Keras .h5 model:")
        print("   tensorflowjs_converter --input_format keras ./smnist.h5 ./app/model/tfjs")
        print("\n2. If you have a SavedModel:")
        print("   tensorflowjs_converter --input_format tf_saved_model ./saved_model ./app/model/tfjs")
        print("\n3. Use TFLite model directly in React Native with react-native-pytorch-core")
        return False

def convert_keras_to_tfjs(keras_model_path):
    """Convert Keras .h5 model to TensorFlow.js format"""

    if not os.path.exists(keras_model_path):
        print(f"✗ Keras model file not found at {keras_model_path}")
        return False

    print(f"✓ Found Keras model at {keras_model_path}")

    output_dir = "./app/model/tfjs"
    os.makedirs(output_dir, exist_ok=True)

    print(f"Converting Keras model to TensorFlow.js format...")

    try:
        cmd = [
            "tensorflowjs_converter",
            "--input_format", "keras",
            keras_model_path,
            output_dir
        ]

        subprocess.check_call(cmd)
        print(f"✓ Model converted successfully to {output_dir}")
        print("\nGenerated files:")
        for file in os.listdir(output_dir):
            print(f"  - {file}")

        return True

    except subprocess.CalledProcessError as e:
        print(f"✗ Error during conversion: {e}")
        return False

def main():
    print("=== TensorFlow Model Converter ===\n")

    # Check if tensorflowjs is installed
    if not check_tensorflowjs_installed():
        install = input("Would you like to install tensorflowjs? (y/n): ")
        if install.lower() == 'y':
            if not install_tensorflowjs():
                return
        else:
            print("Please install tensorflowjs manually: pip install tensorflowjs")
            return

    print("\nSelect conversion option:")
    print("1. Convert Keras .h5 model to TensorFlow.js")
    print("2. Show instructions for TFLite conversion")

    choice = input("\nEnter choice (1 or 2): ")

    if choice == "1":
        keras_path = input("Enter path to Keras .h5 model (e.g., ./smnist.h5): ")
        convert_keras_to_tfjs(keras_path)
    elif choice == "2":
        print("\n=== TFLite Conversion Instructions ===")
        print("\nDirect TFLite to TensorFlow.js conversion is not straightforward.")
        print("\nRecommended approach:")
        print("1. Use the original Keras .h5 model if available")
        print("2. Convert it using: tensorflowjs_converter --input_format keras ./smnist.h5 ./app/model/tfjs")
        print("\nAlternatively, you can:")
        print("1. Use TensorFlow Lite for React Native (requires native modules)")
        print("2. Convert TFLite back to SavedModel, then to TFJS")
    else:
        print("Invalid choice")

if __name__ == "__main__":
    main()
