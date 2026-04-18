import axios from 'axios';
import { CONSTANTS } from '../utils/constants';

export const axiosClient = axios.create({
  baseURL: CONSTANTS.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(CONSTANTS.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      localStorage.removeItem(CONSTANTS.TOKEN_KEY);
      localStorage.removeItem(CONSTANTS.USER_TYPE_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);
