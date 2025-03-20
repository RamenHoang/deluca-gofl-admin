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

    filter: (status, payment) => {
        let url = `/orders/filter`;

        let query = [];

        if (status) {
            query.push(`status=${status}`);
        }

        if (payment) {
            query.push(`payment=${payment}`);
        }

        if (query.length > 0) {
            url += `?${query.join('&')}`;
        }

        return axiosClient.get(url);
    }
}

export default orderAPI;
