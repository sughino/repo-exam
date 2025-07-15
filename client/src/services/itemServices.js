import useSWR from 'swr';
import { useCallback } from 'react';
import { useAxiosRequest } from '../api/axiosRequest.js';
import { createApiWithRefresh } from '../api/securedApi.js';

const securedApi = createApiWithRefresh();

const filterTextMap = {
  'Request id': '_id',
  'Date': 'requestDate',
  'Price': 'unitCost',
  'Quantity': 'quantity',
};

const itemService = {

  useItem(searchedText, filterText, sortBy, filters ,options = {}) {
    const order = sortBy ? 'desc' : 'asc';
    const orderBy = Array.isArray(filterTextMap[filterText])
    ? filterTextMap[filterText].join(',')
    : filterTextMap[filterText];

    const url = `/get/request?query=${searchedText}&orderBy=${orderBy}&sortBy=${order}&role=${filters.role}`;
    
    const { data, error, isValidating, mutate } = useSWR(
      url,
      (url) => securedApi.get(url).then(res => res.data),
      options
    );

    if (data) {
      localStorage.setItem('itemLength', data.length);
    }
    
    return {
      item: data || [],
      isLoading: !error && !data,
      isValidating,
      isError: error,
      mutate
    };
  },
  useItemInsertion() {
    const { loading, error, makeRequest } = useAxiosRequest();

    const insertItem = useCallback(async (formData) => {
      const url = `/insert/request`;
      
      return makeRequest(() => securedApi.post(url, formData));
    }, [makeRequest]);

    return {
      isInsertLoading: loading,
      isInsertError: error,
      insertItem
    };
  },
  useModifyItem() {
    const { loading, error, makeRequest } = useAxiosRequest();

    const modifyItem = useCallback(async (formData) => {
      const url = `/modify/request`;

      return makeRequest(() => securedApi.put(url, formData));
    }, [makeRequest]);

    return {
      isModifingLoading: loading,
      isModifyError: error,
      modifyItem
    };
  },
  useDeleteItem() {
    const { loading, error, makeRequest } = useAxiosRequest();

    const deleteItem = useCallback(async (_id) => {
      const url = `/delete/request`;
      
      return makeRequest(() => securedApi.delete(url, {
        data: { _id }
      }));
    }, [makeRequest]);

    return {
      isDeletingLoading: loading,
      isDeleteError: error,
      deleteItem
    };
  }
};

export default itemService;