import axiosClient from './axiosClient';

const commentAPI = {
    getAllComments: () => {
        let url = '/comments'
        return axiosClient.get(url);
    }
}

export default commentAPI;
