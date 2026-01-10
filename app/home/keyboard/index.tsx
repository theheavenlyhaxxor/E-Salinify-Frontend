import { SIGN_IMAGES, normalizeToSignKey } from "@/assets/HAND_SIGNS/signs";
import { KeyboardScreenStyle } from "@/assets/styles/KeyboardScreen.style";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Keyboard = () => {
  const router = useRouter();
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState<string>("");

  const handleNavigate = () => {
    router.back();
  };
  const handleTranslate = () => {
    setTranslated(text);
  };
  return (
    <View style={KeyboardScreenStyle.MainContainer}>
      <View style={KeyboardScreenStyle.BackButtonContainer}>
        <TouchableOpacity onPress={handleNavigate}>
          <FontAwesome name="long-arrow-left" size={35} />
        </TouchableOpacity>
      </View>

      <View style={KeyboardScreenStyle.outputContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={KeyboardScreenStyle.signsRow}
        >
          {translated.split("").map((ch, idx) => {
            const key = normalizeToSignKey(ch);
            if (key === " ") {
              return (
                <View key={`space-${idx}`} style={KeyboardScreenStyle.space} />
              );
            }
            if (key && SIGN_IMAGES[key]) {
              return (
                <Image
                  key={`img-${idx}-${key}`}
                  source={SIGN_IMAGES[key]}
                  style={KeyboardScreenStyle.signImage}
                />
              );
            }
            // Fallback for unsupported characters
            return (
              <View key={`unk-${idx}`} style={KeyboardScreenStyle.unknownWrap}>
                <Text style={KeyboardScreenStyle.unknownText}>{ch}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={KeyboardScreenStyle.inputAndButtonContainer}>
        <TextInput
          style={KeyboardScreenStyle.input}
          placeholder="Translate here…"
          value={text}
          onChangeText={setText}
          // onSubmitEditing={Keyboard.dismiss}
        />
        <TouchableOpacity
          onPress={handleTranslate}
          style={KeyboardScreenStyle.TranslateButton}
        >
          <Text style={KeyboardScreenStyle.TranslateButtonText}>Translate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Keyboard;
