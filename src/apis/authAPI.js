import axios from 'axios';

const authAPI = {
    login: (data) => {
        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, data);
    }
}

export default authAPI;