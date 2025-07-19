

import axiosLib from 'axios';
import { Platform } from 'react-native';


// Configuração específica para React Native
const axios = axiosLib.create({
  baseURL: 'https://kibaba.it.ao/api/user/',
  headers: { 
    Accept: "application/json",
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Adicione um interceptor para tratar erros
/* axios.interceptors.response.use(
  response => response,
  error => {
    console.log('Axios error:', error);
    return Promise.reject(error);
  }
); */
/* axios.interceptors.response.use(
  response => response,
  error => {
    console.log('Axios error details:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    return Promise.reject(error);
  }
); */

export default axios;