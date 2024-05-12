import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

const PlayerScore = () => {
  const socket = useContext(SocketContext);
  const [playerScore, setPlayerScore] = useState(0);

  useEffect(() => {
    socket.on("game.score.view", (data) => {
      console.log(data.PlayerScore)
      setPlayerScore(data.playerScore);
    });
  }, []);

  return (
    <View style={styles.playerScoreContainer}>
      <Text>PlayerScore: {playerScore}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    playerScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "lightgrey"
      },
});

export default PlayerScore;