import axiosClient from "./axiosClient";

const customerAPI = {
    getAllCustomers: () => {
        let url = '/users';
        return axiosClient.get(url);
    },

    deleteCustomerById: (id) => {
        let url = `/users/${id}`;
        return axiosClient.delete(url);
    }
}

export default customerAPI;
