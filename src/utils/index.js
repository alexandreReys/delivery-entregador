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
        const order = orders[0];
        store.dispatch(actionSetOrder(order));
        return navigation.navigate('OrderOnTheWay', { orderParam: order });
    };

    orders = await orderService.getDeliveryManOrders("Saiu para entregar");

    if (orders.length > 0) {
        store.dispatch(actionSetOrders(orders));

        setTimeout(() => {
            navigation.navigate("OrderToDeliver");
        }, 500);

        return;
    };

    store.dispatch(actionSetOrders([]));
    navigation.navigate("OrderSelect");
};

export const weekOfYear = () => {
    const currentdate = new Date();
    const oneJan = new Date(currentdate.getFullYear(),0,1);
    const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    return Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
};

// dd/mm/yyyy
export const formattedDate = (date) => {
    const d = date.toString().substring(0, 10);
    return d.substr(8, 2) + "/" + d.substr(5, 2) + "/" + d.substr(0, 4);
};

// param : 2021-07-19T03:00:00.000
// return : { "inicio": "2021-07-19", "final": "2021-07-25" }
export const weekLimits = (date) => {
    let data = new Date( date );
    let data2 = new Date( date );

    let diaSemana = data.getDay();

    let voltar = diaSemana-1;
    data.setDate(data. getDate() - voltar);
   
	let avancar = 7-diaSemana;
    data2.setDate(data2.getDate() + avancar);
    
    return {
        inicio: data.toISOString().split('T')[0],
        final: data2.toISOString().split('T')[0],
    };
};
