import React, { useState, useEffect, useCallback } from "react";
import {
  KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet,
  View, ScrollView, Alert, BackHandler, Linking,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import * as utils from "../../utils";
import * as masks from "../../utils/masks";
import * as orderService from "../../services/orderService";
import store from "../../store";
import { actionClearOrders, actionSetOrder, actionSetOrders } from "../../store/actions";

import SeeMoreHeader from "../../components/SeeMoreHeader";
import Loader from "../../components/Loader";
import { useFocusEffect } from "@react-navigation/native";

const OrderOnTheWay = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const [order, setOrder] = useState(store.getState().orderState.order);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    setOrder(store.getState().orderState.order);
    getOrderItemsList();
    return () => setLoading(false);  // unFocus
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
      return ()=>setLoading(false);  // unFocus
    }, [])
  );

  const getOrderItemsList = async () => {
    async function getOrderItems() {
      const items = await orderService.getOrderItems(order.IdOrder);
      if (items) setOrderItems(items);
    };
    getOrderItems();
    // {
    //   "DescricaoVinho": "Vodka Smirnoff 998ml",
    //   "IdOrderItem": 26,
    //   "idProductOrderItem": 22,
    //   "priceOrderItem": 35.9,
    //   "quantityOrderItem": 1,
    // }
  };

  const onPressBtnEndDelivery = () => {
    Alert.alert("Finalizar Entrega", "Confirma ?", [
      { text: "Sim", onPress: () => handleEndDelivery() },
      { text: "Não", style: "cancel" }
    ], { cancelable: false });
  };

  const handleEndDelivery = async () => {
    setLoading(true);
    const responseOK = await orderService.endDelivery(order.IdOrder);
    setLoading(false);

    if (!responseOK)
      utils.showAlert('Deu Ruim !!', 'Não foi possivel atualizar a operação !!');
    else {
      store.dispatch(actionClearOrders());
      setLoading(true);
      utils.checkAndSend(navigation);
    };
  };

  const handleMapButton = () => {
    navigation.navigate('Map')
  };

  const totalOrder = masks.moneyMask(order.TotalOrder);

  return (
    <KeyboardAvoidingView style={styles.mainContainer}>

      {loading && <Loader />}

      <SeeMoreHeader
        caption="A Caminho"
        exitRoute="Login"
        navigation={navigation}
      />

      {/* Entregador */}
      <View style={styles.deliveryManContainer}>
        <Text style={{ fontWeight: "bold", color: "navy" }}>
          {`Entregador: ${store.getState().loginState.loggedUser}`}
        </Text>
      </View>

      {/* ORDER NUMBER AND MAP */}
      <View style={styles.orderContainer}>
        <View style={{ width: "80%" }}>
          <Text style={{ fontWeight: "bold", color: "maroon" }}>
            Pedido: {order.IdOrder}
          </Text>

          <View style={styles.addressContainer}>
            <Text style={{ fontWeight: "bold", color: "navy" }}>
              Bairro: {order.CustomerNeighborhoodOrder}
            </Text>
            <Text>
              {order.CustomerAddressOrder}
            </Text>
          </View>

        </View>

        <TouchableOpacity
          style={styles.mapContainer}
          onPress={handleMapButton}
        >
          <MaterialIcons
            name="directions"
            style={{ fontSize: 26, color: "blue" }}
          />
          <Text style={{ fontSize: 12, fontWeight: "bold", color: "blue" }}>
            Mapa
          </Text>
        </TouchableOpacity>

      </View>



      <View style={styles.customerContainer}>
        <Text style={{ fontWeight: "bold", color: "navy" }}>
          Cliente: {order.CustomerNameOrder}
        </Text>
      </View>

      <ScrollView vertical style={styles.scroolview}>

        {/* ORDER ITEMS */}
        {orderItems && (
          <View style={styles.itemsContainer}>
            {orderItems.map((item) => {
              return (
                <Text key={item.idProductOrderItem}>
                  {item.quantityOrderItem}x ({item.DescricaoVinho})
                </Text>
              )
            })}
          </View>
        )}

        {/* PAYMENT TYPE */}
        <View style={styles.paymentTypeContainer}>
          <Text style={{ fontWeight: "bold", color: "navy" }}>
            {order.PaymantTypeOrder}
          </Text>
        </View>

        {/* COBRAR NA ENTREGA: */}
        <View style={styles.totalContainer}>
          <Text style={{ fontWeight: "bold", color: "navy" }}>
            COBRAR NA ENTREGA: {totalOrder}
          </Text>
        </View>

      </ScrollView>

      <View style={styles.endDeliveryContainer}>
        <TouchableOpacity
          style={styles.btnEnd}
          onPress={() => { Linking.openURL(`tel:${11987573104}`) }}
        >
          <Text>Ligar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnEnd}
          onPress={onPressBtnEndDelivery}
        >
          <Text style={{ fontWeight: "bold", color: "#666" }}>
            FINALIZAR ENTREGA
          </Text>
        </TouchableOpacity>

      </View>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  deliveryManContainer: {
    marginTop: 20,
    marginLeft: 20,
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
  mapContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffd54f",
    borderRadius: 50,
    paddingHorizontal: 18,
    marginVertical: 1,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  customerContainer: {
    marginTop: 30,
    marginLeft: 20,
  },
  itemsContainer: {
    marginTop: 5,
    marginLeft: 7,
  },
  paymentTypeContainer: {
    marginTop: 30,
    marginLeft: 7,
  },
  totalContainer: {
    marginTop: 10,
    marginLeft: 7,
    marginBottom: 20,
  },
  scroolview: {
    width: "92%",
    borderRadius: 7,
    marginTop: 30,
    marginLeft: "3%",
    marginRight: "3%",
    marginBottom: 20,
  },

  endDeliveryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  btnEnd: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#ffd54f",
    color: "#666",
    fontWeight: "bold",
    borderRadius: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  deuRuim: {
    fontWeight: "bold",
    color: "red",
  },
  font080: {
    fontSize: 10,
  },

});


export default OrderOnTheWay;
