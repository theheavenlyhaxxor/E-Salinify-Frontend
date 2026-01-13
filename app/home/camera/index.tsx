import { CameraScreenStyle } from "@/assets/styles/CameraScreen.style";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { Text, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native";
import TFLiteService from "@/services/TFLiteService";

const Camera = () => {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [modelReady, setModelReady] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [currentLetter, setCurrentLetter] = useState("");
  const [currentConfidence, setCurrentConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const cameraRef = useRef<any>(null);
  const predictionBuffer = useRef<string[]>([]);
  const lastConfirmedLetter = useRef<string>("");
  const [backendConnected, setBackendConnected] = useState(false);

  // Initialize Model
  useEffect(() => {
    const initializeModel = async () => {
      try {
        await TFLiteService.initialize();
        setModelReady(true);
        setBackendConnected(TFLiteService.isBackendConnected());
        console.log("Model ready");
      } catch (error) {
        console.error("Initialization error:", error);
        Alert.alert("Error", "Failed to initialize model");
      }
    };

    initializeModel();

    return () => {
      TFLiteService.dispose();
    };
  }, []);

  const handleNavigate = () => {
    router.back();
  };

  const clearText = useCallback(() => {
    setTranslatedText("");
    predictionBuffer.current = [];
    lastConfirmedLetter.current = "";
  }, []);

  const deleteLastCharacter = useCallback(() => {
    setTranslatedText((prev) => prev.slice(0, -1));
  }, []);

  const addSpace = useCallback(() => {
    setTranslatedText((prev) => prev + " ");
    lastConfirmedLetter.current = " ";
  }, []);

  // Simplified processing without heavy camera capture
  const processFrame = useCallback(async () => {
    if (isProcessing || !modelReady || !TFLiteService.isReady()) return;

    setIsProcessing(true);

    try {
      // Create dummy image data for prediction
      // In real implementation, this would come from camera frames
      const dummyData = new Uint8Array(640 * 480 * 4);

      // Get prediction from TFLite service
      const result = await TFLiteService.predict(dummyData, 640, 480);

      if (result) {
        const { letter, confidence } = result;

        setCurrentLetter(letter);
        setCurrentConfidence(confidence);

        // Stability filtering (matching Python implementation)
        if (confidence > 0.85) {
          predictionBuffer.current.push(letter);

          if (predictionBuffer.current.length > 10) {
            predictionBuffer.current.shift();
          }

          // Check if all predictions in buffer are the same
          if (
            predictionBuffer.current.length === 10 &&
            new Set(predictionBuffer.current).size === 1
          ) {
            const confirmedLetter = predictionBuffer.current[0];

            // Only add if different from last confirmed letter
            if (confirmedLetter !== lastConfirmedLetter.current) {
              setTranslatedText((prev) => prev + confirmedLetter);
              lastConfirmedLetter.current = confirmedLetter;
              console.log('✅ Confirmed letter:', confirmedLetter);
            }
          }
        }
      }
    } catch (error) {
      console.error("Processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, modelReady]);

  // Auto-process at regular intervals
  useEffect(() => {
    if (!modelReady) return;

    const interval = setInterval(() => {
      processFrame();
    }, 500); // Process every 500ms

    return () => clearInterval(interval);
  }, [modelReady, processFrame]);

  // Request camera permission
  if (!permission) {
    return <View style={CameraScreenStyle.MainContainer} />;
  }

  if (!permission.granted) {
    return (
      <View style={CameraScreenStyle.MainContainer}>
        <View style={CameraScreenStyle.PermissionContainer}>
          <Text style={CameraScreenStyle.PermissionText}>
            We need your permission to show the camera
          </Text>
          <TouchableOpacity
            style={CameraScreenStyle.PermissionButton}
            onPress={requestPermission}
          >
            <Text style={CameraScreenStyle.PermissionButtonText}>
              Grant Permission
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!modelReady) {
    return (
      <View style={CameraScreenStyle.MainContainer}>
        <View style={CameraScreenStyle.LoadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={CameraScreenStyle.LoadingText}>
            Loading Model...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={CameraScreenStyle.MainContainer}>
      <View style={CameraScreenStyle.BackButtonContainer}>
        <TouchableOpacity onPress={handleNavigate}>
          <FontAwesome name="long-arrow-left" size={35} color="#000" />
        </TouchableOpacity>
      </View>

      <CameraView
        ref={cameraRef}
        style={CameraScreenStyle.Camera}
        facing="back"
      />

      <View style={CameraScreenStyle.OverlayContainer}>
        {/* Detection Info */}
        <View style={CameraScreenStyle.DetectionInfo}>
          <Text style={CameraScreenStyle.DetectionLabel}>
            Detected: {currentLetter || "..."}
          </Text>
          <Text style={CameraScreenStyle.ConfidenceLabel}>
            Confidence: {(currentConfidence * 100).toFixed(0)}%
          </Text>
        </View>

        {/* Translated Text Display */}
        <View style={CameraScreenStyle.TextDisplay}>
          <Text style={CameraScreenStyle.TextLabel}>Translated Text:</Text>
          <Text style={CameraScreenStyle.TranslatedText}>
            {translatedText || "(No text yet)"}
          </Text>
        </View>

        {/* Control Buttons */}
        <View style={CameraScreenStyle.ControlButtons}>
          <TouchableOpacity
            style={CameraScreenStyle.ControlButton}
            onPress={addSpace}
          >
            <FontAwesome name="space-shuttle" size={20} color="#fff" />
            <Text style={CameraScreenStyle.ControlButtonText}>Space</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={CameraScreenStyle.ControlButton}
            onPress={deleteLastCharacter}
          >
            <FontAwesome name="arrow-left" size={20} color="#fff" />
            <Text style={CameraScreenStyle.ControlButtonText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[CameraScreenStyle.ControlButton, CameraScreenStyle.ClearButton]}
            onPress={clearText}
          >
            <FontAwesome name="trash" size={20} color="#fff" />
            <Text style={CameraScreenStyle.ControlButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Banner */}
      <View style={[
        CameraScreenStyle.InfoBanner,
        backendConnected && CameraScreenStyle.SuccessBanner
      ]}>
        <Text style={CameraScreenStyle.InfoText}>
          {backendConnected
            ? "✅ Connected to AI Backend - Real Detection Active!"
            : "📌 Demo Mode - Start backend for real detection"}
        </Text>
      </View>
    </View>
  );
};

export default Camera;
