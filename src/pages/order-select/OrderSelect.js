import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet,
    View, ScrollView, Alert, BackHandler,
} from "react-native";
import { TextInput, Card, Title, Paragraph } from "react-native-paper";

import * as utils from "../../utils";

import * as orderService from "../../services/orderService";
import store from "../../store";
import { actionSetOrders } from "../../store/actions";

import Header from "../../components/Header";
import Loader from "../../components/Loader";
import img from "../../../assets/splash.png";


const OrderSelect = ({ navigation, orders }) => {
    const [loading, setLoading] = useState(false);

    const [orderId, setOrderId] = useState("");
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true);
    }, []);

    const onPressBtnAdd = () => setShowText(!showText);

    async function onPressBtnConfirm() {

        if (!orderId) return setShowText(false);

        const order = await orderService.getOrder(orderId);
        if (!order) {
            utils.showAlert("Ops !!", "Pedido não encontrado");
            setOrderId("");
            return;
        };

        if (order.StatusOrder !== "Pendente") {
            utils.showAlert("Ops !!", "Pedido não está pendente !!");
            setOrderId("");
            return;
        };

        const exists = orders.filter((it) => it.idOrder == orderId);
        if (exists.length > 0) {
            utils.showAlert("Atenção !!", `Pedido ${orderId} já selecionado`);
            setOrderId("");
            return;
        };

        const newOrder = {
            ...order,
            DeliveryManOrder: store.getState().loginState.loggedUser,
        };

        orders.push(newOrder);
        setShowText(false);
        setOrderId("");
    };

    const onPressBtnProced = () => {
        if (!orders.length) {
            utils.showAlert('Atenção', 'Selecione um pedido para prosseguir !!');
            return;
        };

        Alert.alert("Sair para entrega", "Deseja sair para entrega ?", [
            { text: "Sim", onPress: handleProced },
            { text: "Não", style: "cancel" }
        ], { cancelable: false });

        async function handleProced() {
            setLoading(true);
            const responseOK = await orderService.storeOrdersToDeliver(orders);
            setLoading(false);
            if (!responseOK) {
                utils.showAlert('Deu Ruim !!', 'Não foi possivel atualizar a operação !!');
                return;
            };
            store.dispatch(actionSetOrders(orders));

            setLoading(true);
            setTimeout(()=>{
                setLoading(false);
                navigation.navigate("OrderToDeliver");
            },500);
        };
    };

    return (
        <KeyboardAvoidingView style={styles.background}>
            {loading && <Loader />}

            <Header
                caption="Seleção dos Pedidos"
                exitRoute="Login"
                navigation={navigation}
            />

            <View
                style={styles.container}
            >
                {/* Entregador */}
                <Text style={styles.textDeliveryMan}>
                    {`Entregador: ${store.getState().loginState.loggedUser}`}
                </Text>

                {/* Insira o número dos pedidos */}
                <Text style={styles.textTop}>
                    Insira o número dos pedidos no campo abaixo para prosseguir com a
                    entrega.
                </Text>

                {/* + Adicionar numero do pedido */}
                <Text style={styles.textAddOrder} onPress={onPressBtnAdd}>
                    + Adicionar numero do pedido
                </Text>

                {/* Digite Numero do pedido */}
                {showText && (
                    <>
                        <TextInput
                            mode="outlined"
                            label="Numero do pedido"
                            value={orderId}
                            style={styles.input}
                            onChangeText={(value) => {
                                setOrderId(value);
                            }}
                            keyboardType="numeric"
                            returnKeyType="done"
                            autoCorrect={false}
                        />
                        <TouchableOpacity
                            style={styles.btnConfirm}
                            onPress={onPressBtnConfirm}
                        >
                            <Text style={styles.textConfirm}>Confirmar</Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* cards com os pedidos */}
                {orders && !showText && (
                    <ScrollView vertical style={styles.cardScroolview}>
                        
                        {orders.map((order) => {
                            return (
                                <View key={order.IdOrder} style={styles.card}>
                                    <Card>
                                        <Card.Content>
                                            <Paragraph>Pedido: {order.IdOrder}</Paragraph>
                                            <Title>Bairro : {order.CustomerNeighborhoodOrder}</Title>
                                            <Paragraph style={styles.customerAddressOrder}>
                                                {order.CustomerAddressOrder}
                                            </Paragraph>
                                        </Card.Content>
                                    </Card>
                                </View>
                            );
                        })}

                    </ScrollView>
                )}

                {/* Prosseguir */}
                {!showText && (
                    <TouchableOpacity
                        style={styles.btnProsseguir}
                        onPress={onPressBtnProced}
                    >
                        <Text style={styles.textProced}>
                            Prosseguir
                        </Text>
                    </TouchableOpacity>
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

    textDeliveryMan: {
        marginBottom: 10,
        fontSize: 18,
        fontWeight: "bold",
        color: "blue",
    },

    textTop: {
        marginBottom: 10,
    },

    textAddOrder: {
        alignSelf: "flex-start",
        color: "red",
        marginBottom: 20,
    },

    input: {
        backgroundColor: "#FFF",
        color: "blue",
        width: "90%",
        fontSize: 16,
        marginBottom: 15,
    },

    btnConfirm: {
        backgroundColor: "#35AAFF",
        width: "90%",
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 7,
        marginBottom: 30,
    },

    textConfirm: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },

    cardScroolview: {
        backgroundColor: "#d7ccc8",
        width: "100%",
        marginBottom: 20,
        borderRadius: 7,
        elevation: 5,
    },

    card: {
        width: "96%",
        marginTop: 5,
        marginBottom: 2,
        marginLeft: "2%",
        marginRight: "2%",
        backgroundColor: "white",
        elevation: 5,
    },

    customerAddressOrder: {
        color: "blue",
        fontSize: 12,
    },

    btnProsseguir: {
        backgroundColor: "orange",
        width: "90%",
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        marginBottom: 20,
    },

    textProced: {
        color: "blue",
        fontSize: 18,
        fontWeight: "bold",
    },

});

export default connect((state) => ({
    orders: state.orderState.orders,
}))(OrderSelect);
