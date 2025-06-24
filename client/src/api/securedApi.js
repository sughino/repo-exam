import axios from "axios";
import { api } from "./api";

let refreshPromise = null;

export function createApiWithRefresh() {
    const apiWithRefresh = axios.create({
        baseURL: api.defaults.baseURL,
        withCredentials: true,
    });

    apiWithRefresh.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;

            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                if (!refreshPromise) {
                    refreshPromise = api.post("/auth/refresh")
                        .then(() => {
                            refreshPromise = null;
                        })
                        .catch((refreshError) => {
                            refreshPromise = null;
                            throw refreshError;
                        });
                }

                try {
                    await refreshPromise;
                    return apiWithRefresh(originalRequest);
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return apiWithRefresh;
}