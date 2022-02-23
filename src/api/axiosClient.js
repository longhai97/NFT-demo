import axios from 'axios';

const axiosClient = axios.create({
  baseURL: ' http://192.168.66.125:9999/api/v1.0/',
  headers: {
    'content-type': 'application/json',
  }
})

export default axiosClient