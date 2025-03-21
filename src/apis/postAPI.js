import axiosClient from "./axiosClient";

const postAPI = {
    upload: (formData) => {
        let url = `/posts/upload`;
        return axiosClient.post(url, formData);
    },
    createPost: (data) => {
        let url = `/posts`;
        return axiosClient.post(url, data)
    },
    getAllPosts: () => {
        let url = `/posts`;
        return axiosClient.get(url);
    },
    getPostById: (id) => {
        let url = `/posts/${id}`;
        return axiosClient.get(url);
    },
    deletePostById: (id) => {
        let url = `/posts/${id}`;
        return axiosClient.delete(url);
    },
    updatePostById: (id, data) => {
        let url = `/posts/${id}`;
        return axiosClient.put(url, data);
    }
}

export default postAPI;