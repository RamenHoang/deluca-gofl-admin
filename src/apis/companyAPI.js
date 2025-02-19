import axiosClient from "./axiosClient";

const companyAPI = {
    getAllCompanies: () => {
        let url = '/companies';
        return axiosClient.get(url);
    },

    addNewCompany: (data) => {
        let url = '/companies';
        return axiosClient.post(url, data);
    },

    deleteCompanyById: (id) => {
        let url = `/companies/${id}`;
        return axiosClient.delete(url);
    },

    getCompanyById: (id) => {
        let url = `/companies/${id}`;
        return axiosClient.get(url);
    },

    updateCompanyById: (id, data) => {
        let url = `/companies/${id}`;
        return axiosClient.put(url, data);
    }
}

export default companyAPI;