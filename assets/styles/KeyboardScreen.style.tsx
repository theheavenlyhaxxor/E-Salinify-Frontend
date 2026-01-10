import { COLOR } from "@/constant/colors";
import { StyleSheet } from "react-native";
import { fonts } from "../fonts/fonts";

export const KeyboardScreenStyle = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: COLOR.primary,
    paddingHorizontal: "5%",
    paddingVertical: "5%",
  },

  BackButtonContainer: {
    backgroundColor: COLOR.accent,
    paddingHorizontal: 10,
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 4,
  },
  outputContainer: {
    paddingVertical: 10,
    marginTop: 16,
    width: "100%",
    height: "50%",
  },
  outputTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  signsRow: {
    alignItems: "center",
  },
  signImage: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 6,
  },
  space: {
    width: 20,
    height: 1,
    marginRight: 8,
  },
  unknownWrap: {
    width: 56,
    height: 56,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderRadius: 6,
    borderColor: "#ccc",
  },
  unknownText: {
    fontSize: 16,
  },
  status: {
    padding: 16,
    textAlign: "center",
  },

  inputAndButtonContainer: {
    gap: 20,
  },

  TranslateButton: {
    width: "100%",
    paddingVertical: "3%",
    paddingHorizontal: "20%",
    backgroundColor: COLOR.secondary,
    borderRadius: 15,
    alignItems: "center",
  },

  TranslateButtonText: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: COLOR.primary,
  },
});
