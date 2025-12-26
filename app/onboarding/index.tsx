import { onBoardingPageStyle } from "@/assets/styles/OnBoardingPage.style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const OnBoarding = () => {
  const router = useRouter();

  //function to handleNavigation
  const handleNavigate = () => {
    AsyncStorage.setItem("hasOnBoarded", "true"); //set that the user has already onboarded
    router.replace("/home"); //navigate to home
  };

  return (
    <View style={onBoardingPageStyle.MainContainer}>
      <View style={onBoardingPageStyle.TitleContainer}>
        <Text style={onBoardingPageStyle.Title}>E-Salinify</Text>
      </View>

      <View style={onBoardingPageStyle.ImageContainer}>
        <Text style={onBoardingPageStyle.ImageTextPrimary}>
          Breaking Barriers, One{" "}
          <Text style={onBoardingPageStyle.ImageSignText}>Sign</Text> at a Time
        </Text>
        <Image
          source={require("../../assets/images/onBoarding-image.png")}
          style={onBoardingPageStyle.OnBoardingImage}
        />
        <Text style={onBoardingPageStyle.ImageSecondaryText}>
          Understand and connect through sign language, enabling clearer
          communication without barriers.
        </Text>
      </View>

      <TouchableOpacity
        style={onBoardingPageStyle.GetStartedButton}
        onPress={handleNavigate}
      >
        <Text style={onBoardingPageStyle.GetStartedText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnBoarding;
