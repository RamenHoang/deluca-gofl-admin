import axiosClient from './axiosClient';

const dashboardAPI = {
    countAllOrders() {
        let url = '/dashboards/count-all-orders';
        return axiosClient.get(url);
    },

    countNewOrders() {
        let url = '/dashboards/count-new-orders';
        return axiosClient.get(url);
    },

    countUserRegister() {
        let url = '/dashboards/count-user-register';
        return axiosClient.get(url);
    },

    countAllProducts() {
        let url = '/dashboards/count-all-products';
        return axiosClient.get(url);
    },

    salesDay () {
        let url = '/dashboards/sales-day';
        return axiosClient.get(url);
    },

    salesMonth () {
        let url = '/dashboards/sales-month';
        return axiosClient.get(url);
    },

    salesYear () {
        let url = '/dashboards/sales-year';
        return axiosClient.get(url);
    },

    statisticalOrderStatus() {
        let url = '/dashboards/statistical-order-status';
        return axiosClient.get(url);
    },

    saleMonthOfYear () {
        let url = '/dashboards/sale-month-of-year';
        return axiosClient.get(url);
    },

    productsBestSeller() {
        let url = '/dashboards/products-best-seller';
        return axiosClient.get(url);
    }
}

export default dashboardAPI;
