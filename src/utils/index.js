import { Alert } from "react-native";

import store from "../store";
import { actionSetOrders, actionSetOrder } from "../store/actions";
import * as orderService from "../services/orderService";

export const showAlert = (title, message) => Alert.alert(
  title, message, [{ text: "OK" }], { cancelable: true }
);

export const checkAndSend = async (navigation) => {
  var orders = [];

  orders = await orderService.getDeliveryManOrders("A caminho");

  if (orders.length > 0) {
    store.dispatch(actionSetOrder(orders[0]));

    setTimeout(() => {
      navigation.navigate("OrderOnTheWay");
    },500);

    return;
  };

  orders = await orderService.getDeliveryManOrders("Saiu para entregar");

  if (orders.length > 0) {
    store.dispatch(actionSetOrders(orders));
    
    setTimeout(()=>{
      navigation.navigate("OrderToDeliver");
    }, 500);

    return;
  };

  store.dispatch(actionSetOrders([]));
  navigation.navigate("OrderSelect");
};
