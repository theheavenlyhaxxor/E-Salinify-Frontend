// ⚙️ CONFIGURATION - UPDATE THIS WITH YOUR COMPUTER'S IP ADDRESS
// Find your IP:
//   Linux/Mac: Run `hostname -I | awk '{print $1}'` in terminal
//   Windows: Run `ipconfig` and look for IPv4 Address
const API_URL = "http://192.168.1.30:5000"; // 👈 CHANGE THIS TO YOUR IP

// Labels matching your Python implementation
export const LETTER_LABELS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
];

export const CONFIDENCE_THRESHOLD = 0.85;
export const STABILITY_FRAMES = 10;

interface PredictionResult {
  letter: string;
  confidence: number;
  index: number;
}

class TFLiteService {
  private isInitialized: boolean = false;
  private isBackendAvailable: boolean = false;

  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        return;
      }

      console.log("Checking backend connection...");

      // Check if backend is available
      try {
        console.log(`🔍 Trying to connect to: ${API_URL}/health`);

        const response = await fetch(`${API_URL}/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log(`📡 Response status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          this.isBackendAvailable = data.model_loaded === true;

          if (this.isBackendAvailable) {
            console.log("✅ Backend connected and model loaded!");
            console.log(`   API URL: ${API_URL}`);
          } else {
            console.warn("⚠️ Backend connected but model not loaded");
          }
        } else {
          console.warn(`⚠️ Backend health check failed with status: ${response.status}`);
          this.isBackendAvailable = false;
        }
      } catch (error: any) {
        console.error("❌ Backend connection failed!");
        console.error(`   URL: ${API_URL}`);
        console.error(`   Error: ${error.message || error}`);
        console.warn("\n💡 Troubleshooting:");
        console.warn("   1. Is backend running? Run: cd backend && python3 server.py");
        console.warn("   2. Are phone and computer on same WiFi?");
        console.warn("   3. Is the IP address correct in TFLiteService.ts?");
        console.warn(`   4. Try opening http://${API_URL.replace('http://', '')}/health in phone browser\n`);
        this.isBackendAvailable = false;
      }

      this.isInitialized = true;
      console.log("Model service ready");
    } catch (error) {
      console.error("Error initializing model:", error);
      throw error;
    }
  }

  /**
   * Process image data and return prediction
   */
  async predict(
    imageData: Uint8Array,
    width: number,
    height: number
  ): Promise<PredictionResult | null> {
    if (!this.isInitialized) {
      throw new Error("Model not initialized. Call initialize() first.");
    }

    // If backend is not available, return demo prediction
    if (!this.isBackendAvailable) {
      return this.getDemoPrediction();
    }

    try {
      // Convert image to base64
      const base64Image = this.arrayBufferToBase64(imageData);

      // Send to backend API
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      });

      if (!response.ok) {
        console.error("Prediction request failed:", response.status);
        return this.getDemoPrediction();
      }

      const result = await response.json();

      if (result.error) {
        console.error("Backend error:", result.error);
        return this.getDemoPrediction();
      }

      return {
        letter: result.letter,
        confidence: result.confidence,
        index: result.index,
      };
    } catch (error) {
      console.error("Error during prediction:", error);
      // Fallback to demo mode on error
      return this.getDemoPrediction();
    }
  }

  /**
   * Convert Uint8Array to base64
   */
  private arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }

  /**
   * Generate demo prediction (fallback when backend is unavailable)
   */
  private getDemoPrediction(): PredictionResult {
    const mockIndex = Math.floor(Math.random() * LETTER_LABELS.length);
    const mockConfidence = 0.5 + Math.random() * 0.5;

    return {
      letter: LETTER_LABELS[mockIndex],
      confidence: mockConfidence,
      index: mockIndex,
    };
  }

  /**
   * Check if backend is connected
   */
  isBackendConnected(): boolean {
    return this.isBackendAvailable;
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  dispose(): void {
    this.isInitialized = false;
    this.isBackendAvailable = false;
  }
}

export default new TFLiteService();
