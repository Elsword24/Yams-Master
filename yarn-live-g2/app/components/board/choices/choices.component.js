// choices.component.js
import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

const Choices = () => {
    
    const socket = useContext(SocketContext);

    const [displayChoice, setDisplayChoice] = useState(false);
    const [canMakeChoice, setCanMakeChoice] = useState(false);
    const [idSelectedChoice, setIdSelectedChoice] = useState(null);
    const [availableChoice, setAvailableChoice] = useState([]);

    useEffect(() => {

        socket.on("game.choice.view-state", (data) => {
            setDisplayChoice(data['displayChoice']);
            setCanMakeChoice(data['canMakeChoice']);
            setIdSelectedChoice(data['idSelectedChoice']);
            setAvailableChoice(data['availableChoice']);
        });

    }, []);

    const handleSelectChoice = (choiceId) => {

        if (canMakeChoice) {
            setIdSelectedChoice(choiceId);
            socket.emit("game.choice.selected", { choiceId });
        }
        
    };

    return (
        <View style={styles.choicesContainer}>
            {displayChoice &&
                availableChoice.map((choice) => (
                    <TouchableOpacity
                        key={choice.id}
                        style={[
                            styles.choiceButton,
                            idSelectedChoice === choice.id && styles.selectedChoice,
                            !canMakeChoice && styles.disabledChoice
                        ]}
                        onPress={() => handleSelectChoice(choice.id)}
                        disabled={!canMakeChoice}
                    >
                        <Text style={styles.choiceText}>{choice.value}</Text>
                    </TouchableOpacity>
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    choicesContainer: {
        flex: 3,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: "black",
        backgroundColor: "lightgrey"
    },
    choiceButton: {
        backgroundColor: "white",
        borderRadius: 5,
        marginVertical: 5,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "10%"
    },
    selectedChoice: {
        backgroundColor: "lightgreen",
    },
    choiceText: {
        fontSize: 13,
        fontWeight: "bold",
    },
    disabledChoice: {
        opacity: 0.5,
    },
});

export default Choices;
