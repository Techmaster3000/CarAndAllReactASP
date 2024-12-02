import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5255',
});

export default api;
 