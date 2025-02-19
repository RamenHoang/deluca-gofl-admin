import axiosClient from './axiosClient';

const orderAPI = {
    getAllOrders: () => {
        let url = '/orders/get-all-order';
        return axiosClient.get(url);
    },

    getOrderDetailByOrder: (orderId) => {
        let url = `/orders/get-order-detail-by-order/${orderId}`;
        return axiosClient.get(url);
    },

    getOrderDetailByCode: (code) => {
        let url = `orders/get-order-detail-by-code/${code}`;
        return axiosClient.get(url);
    },

    changeStatusOrder: (id, data) => {
        let url = `/orders/change-status-order/${id}`;
        return axiosClient.put(url, data);
    },

    filterByStatus: (status) => {
        let url = `/orders/filter-by-status?status=${status}`;
        return axiosClient.get(url);
    }
}

export default orderAPI;
