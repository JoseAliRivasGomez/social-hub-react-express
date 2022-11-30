import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';

const {VITE_API_URL} = getEnvVariables();

const mainApi = axios.create({
    baseURL: VITE_API_URL,
    withCredentials: true,
});

// mainApi.interceptors.request.use( config => { //todas las requests mandan el token
//     config.headers = {
//         ...config.headers,
//         'x-token': localStorage.getItem('token') 
//     }

//     return config;
// })

export default mainApi;





//EN EL INDEX.JS:
//export {default as calendarApi} from './calendarApi'