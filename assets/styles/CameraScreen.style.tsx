import { COLOR } from "@/constant/colors";
import { StyleSheet } from "react-native";

export const CameraScreenStyle = StyleSheet.create({
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
});
