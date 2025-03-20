import axiosClient from "./axiosClient";

const paymentAPI = {
    getPaymentInfo: (id) => {
        let url = `/payments`;
        return axiosClient.get(url);
    },

    updatePaymentInfo: (item) => {
        let url = `/payments`;
        return axiosClient.put(url, {
            qrCode: item.transferQRCode._id
        });
    },

    uploadQRCode: (formData) => {
        let url = `/payments/upload`;
        return axiosClient.post(url, formData);
    }

}

export default paymentAPI;