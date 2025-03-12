import axiosClient from "./axiosClient";

const productAPI = {
    getAllProduct: () => {
        let url = '/products';
        return axiosClient.get(url);
    },

    addNewProduct: (data) => {
        let url = '/products';
        return axiosClient.post(url, data);
    },

    deleteProductById: (id) => {
        let url = `/products/${id}`;
        return axiosClient.delete(url);
    },

    getProductById: (id) => {
        let url = `/products/${id}`;
        return axiosClient.get(url);
    },

    updateProductById: (id, data) => {
        let url = `/products/${id}`;
        return axiosClient.put(url, data);
    },

    changeProductHotById: (id, data) => {
        let url = `/products/change-product-hot/${id}`;
        return axiosClient.put(url, data);
    },

    uploadImages: (data) => {
        let url = '/products/upload';
        return axiosClient.post(url, data);
    }
}

export default productAPI;
