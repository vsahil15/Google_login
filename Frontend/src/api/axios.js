import axios from 'axios';
 
const API = axios.create({
    baseURL:'https://googlelogin-production-3c33.up.railway.app/',
    withCredentials:true,
});

export default API;