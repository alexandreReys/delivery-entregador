import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { requestPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

const Main = ({ navigation }) => {
  const [currentRegion, setCurrentRegion] = useState(null);

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      }
    }

    loadInitialPosition();
  }, []);

  if (!currentRegion) {
    return null;
  }

  return (
    <>
      <MapView initialRegion={currentRegion} style={styles.map}>
        <Marker
          coordinate={{
            latitude: currentRegion.latitude,
            longitude: currentRegion.longitude,
          }}
        />
      </MapView>
      
      <View style={styles.viewRequestOrderSelect}>
        <TouchableOpacity
          style={styles.btnRequestOrderSelect}
          onPress={() => {
            navigation.navigate("OrderSelect");
          }}
        >
          <MaterialIcons name="my-location" size={20} color="#FFF" />
          <Text style={styles.btnText}>Solicitar Suporte Técnico</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  viewRequestOrderSelect: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  btnRequestOrderSelect: {
    width: "90%",
    height: 70,
    backgroundColor: "blue",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    marginLeft: 10,
  },
});

export default Main;
