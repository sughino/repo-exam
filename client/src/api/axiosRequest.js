import { useCallback, useState } from "react";

export const useAxiosRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const makeRequest = useCallback(async (requestFn) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await requestFn();
        return {
          success: true,
          response: response.data
        };
      } catch (err) {
        setError(err);
        return {
          success: false,
          error: err.response?.data || 'An error occurred'
        };
      } finally {
        setLoading(false);
      }
    }, []);
  
    return { loading, error, makeRequest };
};