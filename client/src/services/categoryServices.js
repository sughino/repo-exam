import useSWR from 'swr';
import { createApiWithRefresh } from '../api/securedApi.js';

const securedApi = createApiWithRefresh();

const categoryService = {
  useCategory() {
    const { data, error, isValidating, mutate } = useSWR(
      "/get/category",
      async (url) => {
        const response = await securedApi.get(url);
        return response.data;
      }
    );

    return {
      categories: data || [],
      isLoadingCategory: !data && !error,
      isValidating,
      isError: !!error,
      mutate
    };
  }
};

export default categoryService;