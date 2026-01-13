import { COLOR } from "@/constant/colors";
import { StyleSheet } from "react-native";

export const CameraScreenStyle = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: COLOR.primary,
  },

  BackButtonContainer: {
    backgroundColor: COLOR.accent,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },

  Camera: {
    flex: 1,
    width: "100%",
  },

  OverlayContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  DetectionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 10,
  },

  DetectionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  ConfidenceLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },

  TextDisplay: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    minHeight: 80,
  },

  TextLabel: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 5,
  },

  TranslatedText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    minHeight: 30,
  },

  ControlButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },

  ControlButton: {
    flex: 1,
    backgroundColor: COLOR.accent,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 5,
  },

  ClearButton: {
    backgroundColor: "#f44336",
  },

  ControlButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  PermissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  PermissionText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },

  PermissionButton: {
    backgroundColor: COLOR.accent,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },

  PermissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  LoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  LoadingText: {
    fontSize: 16,
    color: "#fff",
    marginTop: 15,
  },

  InfoBanner: {
    position: "absolute",
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 193, 7, 0.9)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  InfoText: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
    fontWeight: "500",
  },

  SuccessBanner: {
    backgroundColor: "rgba(76, 175, 80, 0.9)",
  },
});
