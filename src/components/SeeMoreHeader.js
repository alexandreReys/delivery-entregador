import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import { Feather } from "@expo/vector-icons";

const Header = ({ caption, exitRoute, navigation }) => {

    return (

        <View style={headerStyles.header}>
            <Feather
                style={headerStyles.headerIcon}
                name="arrow-left"
                onPress={() => { navigation.navigate(exitRoute) }}
            />
            <Text style={headerStyles.headerText}>{caption}</Text>

            <TouchableOpacity 
                style={{ justifyContent: "center", alignItems: "center", width: 90 }}
                onPress={() => { navigation.navigate("WentWrong") }}
            >
                <Text style={{color: "red", fontWeight: "bold"}} >Deu Ruim</Text>
            </TouchableOpacity>
        </View>

    );

};

const headerStyles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "#d7ccc8",
        width: "100%",
    },
    headerIcon: {
        width: 50,
        fontSize: 28,
        color: "#283593"
    },
    headerText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#283593",
        alignSelf: "center"
    },
});

export default Header;
