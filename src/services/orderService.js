import { api } from "../services/api";
import store from "../store";

export const getOrders = async (status) => {
    var response;
    if (!status) {
        response = await api.get("/delivery-order");
    } else {
        response = await api.get(`/delivery-order/status/${status}`);
    }
    if (response.data.length == 0) return [];
    return response.data;
};

export const getOrderById = async (orderId) => {
    const response = await api.get(`/delivery-order/id/${orderId}`);
    if (response.data.length == 0) return null;
    return response.data[0];
};

export const getDeliveryManOrders = async (status) => {
    const deliveryMan = store.getState().loginState.loggedUser;
    const queryParams = { params: { deliveryMan, status } };
    const response = await api.get("/delivery-order/deliveryman-status/", queryParams);
    if (response.data.length == 0) return [];
    return response.data;
};

export const getOrderItems = async (orderId) => {
    const response = await api.get(`/delivery-order/items/${orderId}`);
    if (response.data.length == 0) return null;
    return response.data;
};

export const storeOrdersToDeliver = async (orders) => {
    const response = await api.post("/delivery-order/leaving", orders);
    return response.data;
};

export const startDelivery = async (orderId) => {
    const response = await api.put(`/delivery-order/start-delivery/${orderId}`);
    return response.data;
};

export const endDelivery = async (orderId) => {
    const response = await api.put(`/delivery-order/end-delivery/${orderId}`);
    return response.data;
};

export const wentWrong = async (orderId) => {
    const response = await api.put(`/delivery-order/went-wrong-delivery/${orderId}`);
    return response.data;
};

export const getDeliveryHistory = async (deliveryman) => {
    const response = await api.get(`/delivery-order/deliveryman/totals/date/${deliveryman}`);
    return response.data;
};
