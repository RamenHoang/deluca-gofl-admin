import axiosClient from "./axiosClient";

const categoryAPI = {
    all: () => {
        let url = '/option-values';
        return axiosClient.get(url);
    },

    add: (data) => {
        let url = '/option-values';
        return axiosClient.post(url, data);
    },

    delete: (id) => {
        let url = `/option-values/${id}`;
        return axiosClient.delete(url);
    },
    
    get: (id) => {
        let url = `/option-values/${id}`;
        return axiosClient.get(url);
    },

    update: (id, item) => {
        let url = `/option-values/${id}`;
        return axiosClient.put(url, item);
    }

}

export default categoryAPI;