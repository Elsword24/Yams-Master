import { StyleSheet, View, Button } from "react-native";

export default function HomeScreen({ navigation }) {

  return (
    <View style={[styles.container, styles.background]}>
      <View>
        <Button
          title="Jouer en ligne"
          onPress={() => navigation.navigate('OnlineGameScreen')}
        />
      </View>
      <View>
        <Button
          title="Jouer contre le bot"
          onPress={() => navigation.navigate('VsBotGameScreen')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0c29",
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    backgroundColor: "#0f0c29", // Couleur de fond
  }
});