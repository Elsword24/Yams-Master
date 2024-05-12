import { StyleSheet, View, TouchableOpacity, Text} from "react-native";

export default function HomeScreen({ navigation }) {

  return (
    <View style={[styles.container, styles.background]}>
      <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('OnlineGameScreen')}
      >
        <Text style={styles.buttonText}>Jouer en ligne</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('VsBotGameScreen')}
      >
        <Text style={styles.buttonText}>Jouer contre le bot</Text>
      </TouchableOpacity>
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
  },
  buttonContainer: {
    marginBottom: 20, // Ajoute de l'écart entre les boutons
  },
  button: {
    backgroundColor: "#000000",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  }
});