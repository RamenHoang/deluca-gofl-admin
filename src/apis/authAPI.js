import axios from 'axios';

const authAPI = {
    login: (data) => {
        return axios.post("http://localhost:5500/api/login", data);
    }
}

export default authAPI;