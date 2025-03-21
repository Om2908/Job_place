import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); 
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance; 