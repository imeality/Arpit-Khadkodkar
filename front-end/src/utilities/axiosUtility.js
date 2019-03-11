import axios from 'axios';

var instance = axios.create({
    baseURL: 'http://localhost:5005',
});

//console.log("instance --- ", instance);

instance.interceptors.request.use(function (config) {
    config.headers.Authorization = "Bearer " + localStorage.getItem('token');
    return config;
}, (error) => {
    return Promise.reject(error);
});


export default instance;