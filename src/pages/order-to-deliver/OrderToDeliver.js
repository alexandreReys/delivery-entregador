import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
    KeyboardAvoidingView, Text, StyleSheet,
    View, ScrollView, Alert, BackHandler
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

import store from "../../store";
import { actionSetOrder, actionSetOrders } from "../../store/actions";

import * as utils from "../../utils";
import * as orderService from "../../services/orderService";

import Header from "../../components/Header";





const OrderToDeliver = ({ navigation, orders }) => {

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.navigate("Login");
            return true;
        });
        return () => BackHandler.removeEventListener('hardwareBackPress');
    }, []);

    const startDelivery = (order) => {
        Alert.alert(`Iniciar Entrega do Pedido ${order.IdOrder}`, "Confirma ?", [
            { text: "Sim", onPress: () => handleStartDelivery(order) },
            { text: "Não", style: "cancel" }
        ], { cancelable: false });
    };

    const handleStartDelivery = async (order) => {
        const responseOK = await orderService.startDelivery(order.IdOrder);
        if (!responseOK)
            utils.showAlert('Deu Ruim !!', 'Não foi possivel atualizar a operação !!');
        else {
            store.dispatch(actionSetOrder(order));
            store.dispatch(actionSetOrders([]));
            navigation.navigate("OrderOnTheWay");
        }
    };

    return (
        <KeyboardAvoidingView style={styles.background}>
            <Header
                caption="Pedidos Selecionados"
                exitRoute="Login"
                navigation={navigation}
            />

            <View
                style={styles.container}
            >
                
                {orders && (
                    <ScrollView vertical style={styles.cardScroolview}>
                        {orders.map((order) => {
                            return (
                                <View key={order.IdOrder} style={styles.card}>
                                    <Card>
                                        <Card.Content>
                                            <View style={styles.container2}>
                                                <Text>Pedido: {order.IdOrder}</Text>
                                                <Text
                                                    style={styles.seeMore}
                                                    onPress={() => {
                                                        store.dispatch(actionSetOrder(order));
                                                        navigation.navigate("SeeMore");
                                                    }}
                                                >
                                                    Ver Mais
                                                </Text>
                                            </View>

                                            <Title>Bairro : {order.CustomerNeighborhoodOrder}</Title>

                                            <Paragraph style={styles.address}>
                                                {order.CustomerAddressOrder}
                                            </Paragraph>

                                            <Paragraph
                                                style={styles.startDelivery}
                                                onPress={() => startDelivery(order)}
                                            >
                                                Iniciar Entrega
                                            </Paragraph>
                                        </Card.Content>
                                    </Card>
                                </View>
                            );
                        })}
                    </ScrollView>
                )}

            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#0000",
    },

    container: {
        flex: 1,
        alignItems: "center",
        width: "90%",
        marginTop: 10,
    },

    cardScroolview: {
        backgroundColor: "#0000",
        width: "100%",
        marginBottom: 20,
        borderRadius: 7,
    },

    card: {
        width: "96%",
        marginTop: 5,
        marginBottom: 2,
        marginLeft: "2%",
        marginRight: "2%",
    },

    container2: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    seeMore: {
        alignSelf: "flex-end",
        color: "red",
        fontWeight: "bold",
    },

    address: {
        color: "blue",
        fontSize: 12,
    },

    startDelivery: {
        alignSelf: "center",
        color: "red",
        fontWeight: "bold",
    },

});

export default connect((state) => ({
    orders: state.orderState.orders,
}))(OrderToDeliver);
