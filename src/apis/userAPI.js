import axiosClient from './axiosClient';

const userAPI = {
    getUserById: (id) => {
        let url = `/users/${id}`;
        return axiosClient.get(url);
    },

    updatePassword: (data) => {
        let url = `/users/update-password`;
        return axiosClient.put(url, data);
    },

    updateUserInfo: (id, data) => {
        let url = `/users/update-info/${id}`;
        return axiosClient.put(url, data);
    }
}

export default userAPI;
