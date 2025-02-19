import axios from 'axios';
import getCookie from './../utils/getCookie';


const axiosClient = axios.create({
    baseURL: 'http://localhost:5500/api',
    headers: {
        "Content-Type": "application/json",
        // "Authorization": getCookie('authAdminToken')
    }
});

axiosClient.interceptors.request.use(async (config) => {
    
    config.headers['Authorization'] = getCookie('authAdminToken');

    return await config;
})

export default axiosClient;