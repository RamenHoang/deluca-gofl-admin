import axiosClient from "./axiosClient";

const bannerAPI = {
    addNewBanner: (data) => {
        let url = '/banners';
        return axiosClient.post(url, data);
    },

    getAllBanners: () => {
        let url = '/banners';
        return axiosClient.get(url);
    },

    deleteBannerById: (id) => {
        let url = `/banners/${id}`;
        return axiosClient.delete(url);
    },

    getBannerById: (id) => {
        let url = `/banners/${id}`;
        return axiosClient.get(url);
    },

    updateBannerById: (id, data) => {
        let url = `/banners/${id}`;
        return axiosClient.put(url, data);
    }
}

export default bannerAPI;