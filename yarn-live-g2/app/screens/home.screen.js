import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import io from "socket.io-client";

console.log('Emulation OS Platform: ', Platform.OS);
// Also usable : "http://10.0.2.2:3000"
export const socketEndpoint = Platform.OS === 'web' ? "http://localhost:3000" : "http://192.168.103.134:3000";
// '172.20.10.3' must be replaced by your intern IP adress

export default function HomeScreen() {
  const [hasConnection, setConnection] = useState(false);
  const [time, setTime] = useState(null);

  useEffect(function didMount() {
    const socket = io(socketEndpoint, {
      transports: ["websocket"],
    });

    socket.io.on("open", () => setConnection(true));
    socket.io.on("close", () => setConnection(false));

    socket.on("time-msg", (data) => {
      setTime(new Date(data.time).toString());
    });

    return function didUnmount() {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, []);

  return (
    <View style={styles.container}>
      {!hasConnection && (
        <>
          <Text style={styles.paragraph}>
            Connecting to {socketEndpoint}...
          </Text>
          <Text style={styles.footnote}>
            Make sure the backend is started and reachable
          </Text>
        </>
      )}

      {hasConnection && (
        <>
          <Text style={[styles.paragraph, { fontWeight: "bold" }]}>
            Server time
          </Text>
          <Text style={styles.paragraph}>{time}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  paragraph: {
    fontSize: 16,
  },
  footnote: {
    fontSize: 14,
    fontStyle: "italic",
  },
});
