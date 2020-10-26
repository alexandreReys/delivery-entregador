import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { WebView } from "react-native-webview";
import { requestPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import store from "../../store";

function Map({ navigation }) {
  const [order] = useState(store.getState().orderState.order);
  const [uri, setUri] = useState("");

  useEffect(() => {
    async function loadPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;

        const uriPre = "https://www.google.com.br/maps/dir";
        const addr = order.CustomerAddressOrder;
        const zip = order.CustomerPostalCodeOrder;
        const uri1 = `${uriPre}/${latitude},${longitude}/${addr}, ${zip}`;
        
        setUri(uri1);
      }
    }
    loadPosition();
  }, []);

  return (
      <WebView style={{ flex: 1 }} source={{uri}} />
  );
};

export default Map
