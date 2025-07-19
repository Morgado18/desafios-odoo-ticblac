

import axiosLib from 'axios';

const axiosAuth = axiosLib.create({
  baseURL: 'https://kibaba.it.ao/api/',
  headers: { 
    Accept: "application/json",
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

axiosAuth.interceptors.response.use(
  response => response,
  error => {
    console.log('Axios error details:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    return Promise.reject(error);
  }
);;

export default axiosAuth;