import { COLOR } from "@/constant/colors";
import { StyleSheet } from "react-native";
import { fonts } from "../fonts/fonts";

export const onBoardingPageStyle = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: COLOR.primary,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "5%",
    paddingVertical: "10%",
  },
  TitleContainer: {
    width: "100%",
  },
  Title: {
    fontSize: 30,
    fontFamily: fonts.bold,
    color: COLOR.secondary,
    textAlign: "left",
  },
  ImageContainer: {
    height: "70%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: "8%",
  },
  ImageTextPrimary: {
    fontSize: 25,
    fontFamily: fonts.bold,
  },
  ImageSignText: {
    color: COLOR.secondary,
  },

  ImageSecondaryText: {
    fontSize: 18,
    fontFamily: fonts.medium,
    textAlign: "center",
  },
  OnBoardingImage: {
    width: 350,
    height: 260,
  },

  GetStartedButton: {
    backgroundColor: COLOR.secondary,
    width: "60%",
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 20,
  },

  GetStartedText: {
    color: COLOR.primary,
    textAlign: "center",
    fontSize: 20,
    fontFamily: fonts.bold,
  },
});
