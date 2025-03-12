import axiosClient from "./axiosClient";

const colorAPI = {
    getAll: () => {
        let url = '/sizes';
        return axiosClient.get(url);
    },

    create: (data) => {
        let url = '/sizes';
        return axiosClient.post(url, data);
    },

    delete: (id) => {
        let url = `/sizes/${id}`;
        return axiosClient.delete(url);
    },
    
    getById: (id) => {
        let url = `/sizes/${id}`;
        return axiosClient.get(url);
    },

    updateById: (id, item) => {
        let url = `/sizes/${id}`;
        return axiosClient.put(url, item);
    }

}

export default colorAPI;