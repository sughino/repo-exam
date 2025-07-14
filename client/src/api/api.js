import axios from "axios";

export const api = axios.create({
    baseURL: 'https://repo-exam-server.vercel.app/api',
    withCredentials: true,
});

export const fetcher = (url) => api.get(url).then(res => res.data);