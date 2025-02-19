import axiosClient from './axiosClient';

const staffAPI = {
    getAllStaffs: () => {
        let url = '/staffs';
        return axiosClient.get(url);
    },

    addNewStaff: (data) => {
        let url = '/staffs';
        return axiosClient.post(url, data);
    },

    deleteStaffById: (id) => {
        let url = `/staffs/${id}`;
        return axiosClient.delete(url);
    },

    getStaffById: (id) => {
        let url = `/staffs/${id}`;
        return axiosClient.get(url);
    },

    updateStaffById: (id, data) => {
        let url = `/staffs/${id}`;
        return axiosClient.put(url, data);
    }
}

export default staffAPI;
