import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

export const fetcher = (url) => api.get(url).then(res => res.data);