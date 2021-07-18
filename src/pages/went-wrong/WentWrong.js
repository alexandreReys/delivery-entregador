import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView, TouchableOpacity,
  View, StyleSheet, Text, Alert, BackHandler,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Picker } from "@react-native-community/picker";

import * as utils from "../../utils";
import store from "../../store";
import { actionClearOrders } from "../../store/actions";
import * as orderService from "../../services/orderService";
import Header from "../../components/Header";

const SeeMore = ({ navigation }) => {
  const [order] = useState(store.getState().orderState.order);
  const [occurrence, setOccurrence] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate("OrderOnTheWay");
        return true;
    });
    // return () => BackHandler.removeEventListener('hardwareBackPress');
}, []);

  const onPressBtnConfirm = () => {
    Alert.alert("Finalizar Entrega", "Confirma ?", [
      { text: "Sim", onPress: () => handleBtnConfirm() },
      { text: "Não", style: "cancel" }
    ], { cancelable: false });
  };

  const handleBtnConfirm = async () => {
    const responseOK = await orderService.wentWrong(order.IdOrder);
    if (!responseOK)
      utils.showAlert('Deu Ruim !!', 'Não foi possivel atualizar a operação !!');
    else {
      store.dispatch(actionClearOrders());
      utils.checkAndSend(navigation);
    };
  };

  return (
    <KeyboardAvoidingView style={styles.mainContainer}>

      <Header
        caption="Deu Ruim !!"
        exitRoute="goBack"
        navigation={navigation}
      />

      {/* ORDER NUMBER, CUSTOMER ADDRESS AND MAP */}
      <View style={styles.orderContainer}>
        <View style={{ width: "80%" }}>
          <Text style={{ fontWeight: "bold", color: "maroon" }}>
            Pedido: {order.IdOrder}
          </Text>

          <View style={styles.addressContainer}>
            <Text style={{ fontWeight: "bold", color: "maroon" }}>
              Bairro: {order.CustomerNeighborhoodOrder}
            </Text>
            <Text>
              {order.CustomerAddressOrder}
            </Text>
          </View>

        </View>
      </View>

      <View style={styles.customerContainer}>
        <Text style={{ fontWeight: "bold", color: "maroon" }}>
          Cliente: {order.CustomerNameOrder}
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View
          style={{
            width: "100%",
            borderWidth: 1,
            borderColor: "#999",
            padding: 10,
            borderRadius: 10,
            backgroundColor: "#F2F3F4",
            elevation: 5,
          }}
        >
          <Text style={{ color: "navy", fontWeight: "bold" }}>Selecione o motivo:</Text>

          <Picker
            style={{
              marginTop: 10,
              height: 35,
              backgroundColor: "white",
            }}
            selectedValue={occurrence}
            onValueChange={(itemValue, itemIndex) => setOccurrence(itemValue)}>
            <Picker.Item label="Endereço não existe" value="Endereço não existe" />
            <Picker.Item label="Cliente não atendeu" value="Cliente não atendeu" />
            <Picker.Item label="Produtos errados" value="Produtos errados" />
            <Picker.Item label="Bebidas não estão geladas" value="Bebidas não estão geladas" />
            <Picker.Item label="Outros" value="Outros" />
          </Picker>

        </View>

        <TextInput
          style={{
            marginTop: 30,
            fontSize: 14,
            color: "red",
            backgroundColor: "white",
          }}
          mode="outlined"
          label="Detalhes da ocorrência"
          value={details}
          onChangeText={(value) => { setDetails(value) }}
          keyboardType="default"
          returnKeyType="done"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={styles.btnConfirm}
          onPress={onPressBtnConfirm}
        >
          <Text style={styles.textConfirm}>Confirmar</Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  orderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginHorizontal: "5%",
  },
  addressContainer: {
    marginTop: 10,
  },
  customerContainer: {
    marginTop: 15,
    marginLeft: 20,
  },
  formContainer: {
    padding: 20,
  },
  btnConfirm: {
    backgroundColor: "#35AAFF",
    width: "100%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    marginVertical: 30,
  },
  textConfirm: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});


export default SeeMore;
