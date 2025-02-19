import axiosClient from'./axiosClient';

const authorAPI = {
    getAllAuthors: () => {
        let url = '/authors';
        return axiosClient.get(url);
    },

    addNewAuthor: (data) => {
        let url = '/authors';
        return axiosClient.post(url, data);
    },

    deleteAuthorById: (id) => {
        let  url = `/authors/${id}`;
        return axiosClient.delete(url);
    },
    
    getAuthorById: (id) => {
        let url = `/authors/${id}`;
        return axiosClient.get(url);
    }
}

export default authorAPI;
