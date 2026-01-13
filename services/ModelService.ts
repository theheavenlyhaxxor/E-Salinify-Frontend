import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

// Labels matching your Python implementation
export const LETTER_LABELS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'
];

export const CONFIDENCE_THRESHOLD = 0.85;
export const STABILITY_FRAMES = 10;

class ModelService {
  private model: tf.GraphModel | null = null;
  private isInitialized: boolean = false;

  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        return;
      }

      // Wait for TensorFlow to be ready
      await tf.ready();

      // Load the TFLite model
      const modelJson = require('../app/model/model.json');
      const modelWeights = require('../app/model/weights.bin');

      this.model = await tf.loadGraphModel(
        bundleResourceIO(modelJson, modelWeights)
      );

      this.isInitialized = true;
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
  }

  async predict(imageData: Uint8Array, width: number, height: number): Promise<{
    letter: string;
    confidence: number;
    index: number;
  } | null> {
    if (!this.model || !this.isInitialized) {
      throw new Error('Model not initialized. Call initialize() first.');
    }

    try {
      // Convert image data to tensor
      const tensor = tf.tensor3d(imageData, [height, width, 4]);

      // Convert RGBA to grayscale
      const grayscale = tf.image.rgbToGrayscale(tensor.slice([0, 0, 0], [-1, -1, 3]));

      // Resize to 28x28 (model input size)
      const resized = tf.image.resizeBilinear(grayscale, [28, 28]);

      // Normalize pixel values to 0-1 range
      const normalized = resized.div(255.0);

      // Add batch dimension and ensure correct shape [1, 28, 28, 1]
      const input = normalized.expandDims(0);

      // Run prediction
      const prediction = this.model.predict(input) as tf.Tensor;
      const probabilities = await prediction.data();

      // Find the class with highest probability
      let maxProb = 0;
      let maxIndex = 0;
      for (let i = 0; i < probabilities.length; i++) {
        if (probabilities[i] > maxProb) {
          maxProb = probabilities[i];
          maxIndex = i;
        }
      }

      // Cleanup tensors
      tensor.dispose();
      grayscale.dispose();
      resized.dispose();
      normalized.dispose();
      input.dispose();
      prediction.dispose();

      return {
        letter: LETTER_LABELS[maxIndex],
        confidence: maxProb,
        index: maxIndex,
      };
    } catch (error) {
      console.error('Error during prediction:', error);
      return null;
    }
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isInitialized = false;
    }
  }
}

export default new ModelService();
