import axios from 'axios';
// import axios from '@nestjs/axios';
// const https = require('https');
const baseURL = '/api/customers/';

const axiosInstance: any = axios.create({
  baseURL,
  withCredentials: true,
  // httpsAgent
});

export default axiosInstance;
