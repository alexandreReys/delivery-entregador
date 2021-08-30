import React, { useEffect } from "react";
import {
    KeyboardAvoidingView, Text, StyleSheet,
    View, ScrollView, BackHandler, Image,
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import store from "../../store";
import { actionSetOrder, actionSetOrders } from "../../store/actions";
import * as utils from "../../utils";
import * as masks from "../../utils/masks";
import * as orderService from "../../services/orderService";
import Header from "../../components/Header";

const DeliveryHistory = ({ navigation, orders }) => {

    const [deliveries, setDeliveries] = React.useState([]);
    const deliveryman = store.getState().loginState.loggedUser;

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.navigate("OrderSelect");
            return true;
        });
        getDeliveryHistory();
        return () => BackHandler.removeEventListener('hardwareBackPress');
    }, []);

    async function getDeliveryHistory() {
        const deliveryHistory = await orderService.getDeliveryHistory(
            store.getState().loginState.loggedUser
        );

        if (deliveryHistory.length > 0) {
            const r = await currentWeekValue(deliveryHistory);
            if (r) return setDeliveries(r)
        };

        setDeliveries(deliveryHistory);
    };

    async function currentWeekValue(obj) {
        let currenctWeek = utils.weekOfYear();
        if (obj[0].Semana == currenctWeek) return null;

        const today = new Date().toISOString().split('T')[0];
        const { inicio, final } = utils.weekLimits(today);

        obj.unshift({
            "DeliveryManOrder": deliveryman,
            "DiaFimSemana": final,
            "DiaInicioSemana": inicio,
            "Hoje": today,
            "NumEntregas": 0,
            "Semana": currenctWeek,
            "SemanaAtual": currenctWeek,
            "TotalReceber": 0,
        });
        return obj;
    };

    return (
        <KeyboardAvoidingView style={styles.background}>
            <Header
                caption="Histórico de Entregas"
                exitRoute="OrderSelect"
                navigation={navigation}
            />

            <View style={styles.container}>
                {deliveries.length == 0 && (
                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>

                                <View style={{ marginRight: 30 }}>
                                    <Image style={{ width: 50, height: 50 }}
                                        source={require("../../../assets/capacete.png")}
                                    />
                                </View>

                                <View>
                                    <Text style={{ marginBottom: 10, fontWeight: "bold", fontSize: 16, color: "blue" }}>
                                        {deliveryman}
                                    </Text>

                                    <Text style={{ marginBottom: 10, fontWeight: "bold", fontSize: 16 }}>
                                        0 Pedidos
                                    </Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                )}

                {deliveries.length > 0 && (
                    <ScrollView vertical style={styles.cardScroolview}>
                        {deliveries.map((delivery, idx) => {
                            // delivery Object {
                            //     "DeliveryManOrder": "Alexandre",
                            //     "DiaFimSemana": "2021-07-04T03:00:00.000Z",
                            //     "DiaInicioSemana": "2021-06-28T03:00:00.000Z",
                            //     "Hoje": "2021-07-19T03:00:00.000Z",
                            //     "NumEntregas": 8,
                            //     "Semana": 27,
                            //     "SemanaAtual": 29,
                            //     "TotalReceber": 40,
                            // }

                            const diaInicioSemana = utils.formattedDate(delivery.DiaInicioSemana);
                            const diaFimSemana = utils.formattedDate(delivery.DiaFimSemana);

                            return (
                                <View key={idx}>
                                    <Card style={styles.card}>
                                        <Card.Content>
                                            {utils.weekOfYear() == delivery.Semana && (

                                                <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>

                                                    <View style={{ marginRight: 30 }}>
                                                        <Image style={{ width: 50, height: 50 }}
                                                            source={require("../../../assets/capacete.png")}
                                                        />
                                                    </View>

                                                    <View>
                                                        <Text style={{ marginBottom: 10, fontWeight: "bold", fontSize: 16, color: "blue" }}>
                                                            {deliveryman}
                                                        </Text>
                                                        <Text style={{ marginBottom: 10, fontWeight: "bold", fontSize: 16, color: "navy" }}>
                                                            Semana Atual
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}

                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
                                                    SEMANA {delivery.Semana}
                                                </Text>
                                                <Text style={{ fontSize: 12 }}>
                                                    {`${diaInicioSemana} a ${diaFimSemana}`}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text>
                                                    {delivery.NumEntregas} Pedidos
                                                </Text>
                                                <Text>
                                                    Total: {masks.moneyMask(delivery.TotalReceber)}
                                                </Text>
                                            </View>
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
        margin: 10,
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
        marginBottom: 8,
        marginHorizontal: "2%",
        backgroundColor: "white",
        elevation: 4,
        borderRadius: 10,
    },
});

export default DeliveryHistory;
