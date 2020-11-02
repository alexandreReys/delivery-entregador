import React, { useState, useEffect } from "react";
import {
    KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet,
    View, ScrollView, BackHandler, Linking,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import * as masks from "../../utils/masks";
import * as orderService from "../../services/orderService";
import store from "../../store";

import Header from "../../components/Header";

const SeeMore = ({ navigation }) => {
    const [order] = useState(store.getState().orderState.order);
    const [orderItems, setOrderItems] = useState([]);

    // useEffect(() => { getOrderItemsList() }, []);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true);
        getOrderItemsList();
    }, []);

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

    const handleMapButton = () => {
        navigation.navigate('Map', order);
    };

    const totalOrder = masks.moneyMask(order.TotalOrder);

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>

            <Header
                caption="Ver detalhes"
                exitRoute="OrderToDeliver"
                navigation={navigation}
            />

            {/* ORDER NUMBER, CUSTOMER ADDRESS AND MAP */}
            <View style={styles.orderContainer}>
                <View style={{ width: "80%" }}>
                    <Text style={{ fontWeight: "bold", color: "navy" }}>
                        Pedido: {order.IdOrder}
                    </Text>

                    <View style={styles.addressContainer}>
                        <Text style={{ fontWeight: "bold", color: "navy" }}>
                            Bairro: {order.CustomerNeighborhoodOrder}
                        </Text>
                        <Text style={{ fontSize: 12 }}>
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
                        style={{ fontSize: 26, color: "yellow" }}
                    />
                    <Text style={{ fontSize: 12, fontWeight: "bold", color: "yellow" }}>
                        Mapa
          </Text>
                </TouchableOpacity>

            </View>

            <View style={styles.customerContainer}>
                <Text style={{ fontWeight: "bold", color: "navy" }}>
                    Cliente: {order.CustomerNameOrder}
                </Text>

                {!!order.CommentsOrder && (
                    <>
                        <Text style={{ fontWeight: "bold", color: "maroon", marginTop: 10 }}>
                            Observações, instruções, referência, etc:
                        </Text>

                        <Text style={{ color: "black", fontSize: 12 }}>
                            {order.CommentsOrder.trim()}
                        </Text>
                    </>
                )}

                <Text style={{ fontWeight: "bold", color: "maroon", marginTop: 20 }}>
                    Pagamento : {order.PaymantTypeOrder}
                </Text>

                <Text style={{ fontWeight: "bold", color: "navy" }}>
                    COBRAR NA ENTREGA: {totalOrder}
                </Text>


            </View>

            <ScrollView vertical style={styles.scroolview}>

                {/* ORDER ITEMS */}
                {orderItems && (
                    <View style={styles.itemsContainer}>
                        {orderItems.map((item) => {
                            return (
                                <Text style={{fontWeight: "bold", fontSize: 12}} key={item.idProductOrderItem}>
                                    {item.quantityOrderItem}x ({item.DescricaoVinho})
                                </Text>
                            )
                        })}
                    </View>
                )}

            </ScrollView>

            <View style={styles.buttonsDeliveryContainer}>

                <TouchableOpacity
                    style={styles.btnEnd}
                    onPress={() => { navigation.goBack() }}
                >
                    <Text style={{ fontWeight: "bold", color: "#fff" }}>
                        Voltar
          </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.btnEnd}
                    onPress={() => { Linking.openURL(`tel:${11987573104}`) }}
                >
                    <Text style={{ fontWeight: "bold", color: "#fff" }}>
                        Ligar
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
        backgroundColor: "blue",
        borderRadius: 50,
        paddingHorizontal: 18,
        marginVertical: 2,

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
        marginTop: 20,
        marginLeft: 20,
    },
    itemsContainer: {
        marginTop: 5,
        marginLeft: 7,
    },
    scroolview: {
        width: "92%",
        borderRadius: 7,
        marginTop: 20,
        marginLeft: "3%",
        marginRight: "3%",
        marginBottom: 20,
    },
    buttonsDeliveryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        marginHorizontal: 20,
    },
    btnEnd: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: "blue",
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


export default SeeMore;
