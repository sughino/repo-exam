import { api } from '../api/api.js';
import { useCallback } from 'react';
import { useAxiosRequest } from '../api/axiosRequest.js';
import { useUser } from '../hooks/useUser.js';
import { createApiWithRefresh } from '../api/securedApi.js';

const securedApi = createApiWithRefresh();

const authServices = {
  useLogin() {
    const { loading, error, makeRequest } = useAxiosRequest();

    const verifyLogin = useCallback(async (loginData) => {
      const url = `/auth/login`;
      
      return makeRequest(() => api.post(url, loginData));
    }, [makeRequest]);

    return {
      isLoginLoading: loading,
      isLoginError: error,
      verifyLogin
    };
  },
  useRegister() {
    const { loading, error, makeRequest } = useAxiosRequest();

    const verifyRegister = useCallback(async (registerData) => {
      const url = `/auth/register`;
 
      return makeRequest(() => api.post(url, registerData));
    }, [makeRequest]);

    return {
      isRegisterLoading: loading,
      isRegisterError: error,
      verifyRegister
    };
  },
  useLogout() {
    const { loading, error, makeRequest } = useAxiosRequest();
    const { setUser } = useUser();
  
    const featchLogout = useCallback(async () => {
      const url = `/auth/logout`;
  
      try {
        const result = await makeRequest(() => api.post(url));
        if (result.success) {
          setUser(null);
        }
        return result;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }, [makeRequest, setUser]);
    return {
      isLogoutLoading: loading,
      isLogoutError: error,
      featchLogout
    };
  },
  useMe() {
    const { loading, error, makeRequest } = useAxiosRequest();
    const { setUser, setIsLoading } = useUser();

    const fetchUser = useCallback(async () => {
      const url = `/auth/me`;

      setIsLoading(true);
      try {
        const result = await makeRequest(() => securedApi.get(url));
        setUser(result?.response?.data);
        return result;
      } catch (err) {
        setUser(null);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, [makeRequest, setUser, setIsLoading]);

    return {
      isMeLoading: loading,
      isMeError: error,
      fetchUser
    };
  }
};

export default authServices;