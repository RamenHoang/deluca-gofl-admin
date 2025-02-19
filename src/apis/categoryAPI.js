import axiosClient from "./axiosClient";

const categoryAPI = {
    getAllCategories: () => {
        let url = '/categories';
        return axiosClient.get(url);
    },

    addNewCate: (data) => {
        let url = '/categories';
        return axiosClient.post(url, data);
    },

    deleteById: (id) => {
        let url = `/categories/${id}`;
        return axiosClient.delete(url);
    },
    
    getCateById: (id) => {
        let url = `/categories/${id}`;
        return axiosClient.get(url);
    },

    updateCateById: (id, item) => {
        let url = `/categories/${id}`;
        return axiosClient.put(url, item);
    }

}

export default categoryAPI;