import { Image, StyleSheet } from "react-native";
import image from "../../assets/cadeado.png"; 

export default function Logo() {
  return (
    <Image
      source={image}
      style={styles.logo}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
    resizeMode: "contain",
  },
});
