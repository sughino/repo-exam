import { api } from '../api/api.js';
import { useCallback } from 'react';
import { useAxiosRequest } from '../api/axiosRequest.js';

const searchService = {
  useSearch() {
    const { loading, error, makeRequest } = useAxiosRequest();

    const searchDelivery = useCallback(async (keyDelivery, withdrawalDate) => {
      if (!keyDelivery || !withdrawalDate) {
        console.error("Parametri mancanti:", { keyDelivery, withdrawalDate });
        return { success: false, error: "Missing parameters" };
      }

      const url = `/general/searchdelivery?keydelivery=${keyDelivery}&withdrawaldate=${withdrawalDate}`;
      return makeRequest(() => api.get(url));
    }, [makeRequest]);
    
    return {
      isSearchLoading: loading,
      isSearchError: error,
      searchDelivery
    };
  }
};

export default searchService;