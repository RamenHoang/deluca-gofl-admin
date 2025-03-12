import axiosClient from "./axiosClient";

const colorAPI = {
    getAll: () => {
        let url = '/colors';
        return axiosClient.get(url);
    },

    create: (data) => {
        let url = '/colors';
        return axiosClient.post(url, data);
    },

    delete: (id) => {
        let url = `/colors/${id}`;
        return axiosClient.delete(url);
    },
    
    getById: (id) => {
        let url = `/colors/${id}`;
        return axiosClient.get(url);
    },

    updateById: (id, item) => {
        let url = `/colors/${id}`;
        return axiosClient.put(url, item);
    }

}

export default colorAPI;